#!/usr/bin/env node

/**
 * EAS version consistency checker.
 *
 * Reads version numbers from all local sources and compares them against
 * the remote values stored on EAS — so you always know if you're in sync
 * before triggering a build.
 *
 * Usage:
 *   yarn eas:version:get    — full report (local + remote + sync status)
 *   yarn eas:version:check  — exit 1 if anything is out of sync (blocks builds)
 */

const {execSync} = require('child_process');
const pkg = require('../package.json');
const fs = require('fs');

const command = process.argv[2];

// ─── Read local sources ───────────────────────────────────────────────────────

function getLocalVersions() {
  const pkgVersion = pkg.version;

  const gradleContent = fs.readFileSync('./android/app/build.gradle', 'utf8');
  const androidVersion     = (gradleContent.match(/versionName\s+"([^"]+)"/) || [])[1] || 'NOT FOUND';
  const androidVersionCode = (gradleContent.match(/versionCode\s+(\d+)/)     || [])[1] || 'NOT FOUND';

  const pbxContent = fs.readFileSync(
    './ios/ReactNativeIgniteKit.xcodeproj/project.pbxproj',
    'utf8',
  );
  const iosVersion     = ((pbxContent.match(/MARKETING_VERSION\s*=\s*([^;]+);/)      || [])[1] || 'NOT FOUND').trim();
  const iosBuildNumber = ((pbxContent.match(/CURRENT_PROJECT_VERSION\s*=\s*([^;]+);/) || [])[1] || 'NOT FOUND').trim();

  return {pkgVersion, androidVersion, androidVersionCode, iosVersion, iosBuildNumber};
}

// ─── Fetch remote EAS build numbers ──────────────────────────────────────────

function getRemoteBuildNumber(platform) {
  try {
    const raw = execSync(
      `npx eas-cli@latest build:version:get -p ${platform} --non-interactive`,
      {encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']},
    );
    const match = raw.match(/(?:buildNumber|versionCode)\s*[-:]\s*(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function get() {
  const {pkgVersion, androidVersion, androidVersionCode, iosVersion, iosBuildNumber} = getLocalVersions();
  const localMatch = pkgVersion === androidVersion && androidVersion === iosVersion;

  console.log('\n━━━ Local versions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  package.json           ${pkgVersion}`);
  console.log(`  Android versionName    ${androidVersion}   (versionCode: ${androidVersionCode})`);
  console.log(`  iOS MARKETING_VERSION  ${iosVersion}   (buildNumber: ${iosBuildNumber})`);
  console.log(localMatch
    ? `\n  ✅ Local versions in sync: ${pkgVersion}`
    : '\n  ❌ LOCAL MISMATCH — align all three files before building',
  );

  console.log('\n━━━ EAS remote build numbers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Fetching from EAS...\n');

  const remoteAndroid = getRemoteBuildNumber('android');
  const remoteIos     = getRemoteBuildNumber('ios');

  const remoteAndroidStr = remoteAndroid ?? 'none yet';
  const remoteIosStr     = remoteIos     ?? 'none yet';

  const localAndroidNum = parseInt(androidVersionCode, 10);
  const remoteAndroidNum = remoteAndroid ? parseInt(remoteAndroid, 10) : null;
  const localIosNum = parseInt(iosBuildNumber, 10);
  const remoteIosNum = remoteIos ? parseInt(remoteIos, 10) : null;

  // Local versionCode > remote means developer manually bumped ahead of EAS — problem.
  const androidAhead = remoteAndroidNum !== null && localAndroidNum > remoteAndroidNum;
  const iosAhead     = remoteIosNum     !== null && localIosNum     > remoteIosNum;

  console.log(`  Android versionCode   local: ${androidVersionCode.padEnd(6)} remote: ${remoteAndroidStr.padEnd(6)}  ${androidAhead ? '❌ local is AHEAD of EAS' : remoteAndroidNum !== null && localAndroidNum < remoteAndroidNum ? '✅ EAS manages (autoIncrement)' : '✅ in sync'}`);
  console.log(`  iOS buildNumber       local: ${iosBuildNumber.padEnd(6)} remote: ${remoteIosStr.padEnd(6)}  ${iosAhead ? '❌ local is AHEAD of EAS' : remoteIosNum !== null && localIosNum < remoteIosNum ? '✅ EAS manages (autoIncrement)' : '✅ in sync'}`);

  console.log('\n  ℹ️  With appVersionSource: remote, EAS owns the build number.');
  console.log('     Local being BEHIND remote is normal (autoIncrement).');
  console.log('     Local being AHEAD of remote means a manual bump — fix it.\n');
}

function check() {
  const {pkgVersion, androidVersion, androidVersionCode, iosVersion, iosBuildNumber} = getLocalVersions();

  let errors = [];
  let warnings = [];

  // ── 1. Local version files must all match ──────────────────────────────────
  if (pkgVersion !== androidVersion || androidVersion !== iosVersion) {
    errors.push(
      'Local version mismatch:',
      `  package.json:          ${pkgVersion}`,
      `  Android versionName:   ${androidVersion}`,
      `  iOS MARKETING_VERSION: ${iosVersion}`,
      '  → Align all three to the same value.',
    );
  }

  // ── 2. Local build numbers must NOT be ahead of EAS remote ────────────────
  console.log('\n⏳ Checking EAS remote build numbers...');

  const remoteAndroid = getRemoteBuildNumber('android');
  const remoteIos     = getRemoteBuildNumber('ios');

  if (remoteAndroid !== null) {
    const localNum  = parseInt(androidVersionCode, 10);
    const remoteNum = parseInt(remoteAndroid, 10);
    if (localNum > remoteNum) {
      errors.push(
        'Android versionCode is ahead of EAS remote:',
        `  local: ${localNum}  remote: ${remoteNum}`,
        '  → Reset local versionCode to match remote, or run eas:version:get to check.',
      );
    }
  } else {
    warnings.push('Android remote versionCode could not be fetched — skipping remote check.');
  }

  if (remoteIos !== null) {
    const localNum  = parseInt(iosBuildNumber, 10);
    const remoteNum = parseInt(remoteIos, 10);
    if (localNum > remoteNum) {
      errors.push(
        'iOS buildNumber is ahead of EAS remote:',
        `  local: ${localNum}  remote: ${remoteNum}`,
        '  → Reset local buildNumber to match remote, or run eas:version:get to check.',
      );
    }
  } else {
    warnings.push('iOS remote buildNumber could not be fetched — skipping remote check.');
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (warnings.length) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.warn(`   ${w}`));
  }

  if (errors.length) {
    console.error('\n❌ BUILD BLOCKED — fix the following before building:\n');
    errors.forEach(e => console.error(`   ${e}`));
    console.error('');
    process.exit(1);
  }

  console.log(`\n✅ All checks passed — ${pkgVersion} is safe to build.\n`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

switch (command) {
  case 'get':
    get();
    break;
  case 'check':
    check();
    break;
  default:
    console.log('\nUsage:');
    console.log('  yarn eas:version:get    full report with remote sync status');
    console.log('  yarn eas:version:check  block build if versions are out of sync\n');
    process.exit(1);
}
