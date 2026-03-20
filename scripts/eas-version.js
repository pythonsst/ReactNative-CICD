#!/usr/bin/env node

/**
 * EAS version consistency checker.
 * Validates that version numbers are aligned across all key files before building.
 *
 * Usage:
 *   node scripts/eas-version.js get    — show all versions
 *   node scripts/eas-version.js check  — exit 1 if any mismatch
 */

const {execSync} = require('child_process');
const pkg = require('../package.json');
const fs = require('fs');

const command = process.argv[2];

function getLocalVersions() {
  const pkgVersion = pkg.version;

  // Android version
  const gradleContent = fs.readFileSync('./android/app/build.gradle', 'utf8');
  const gradleMatch = gradleContent.match(/versionName\s+"([^"]+)"/);
  const androidVersion = gradleMatch ? gradleMatch[1] : 'NOT FOUND';

  // iOS version
  const pbxContent = fs.readFileSync(
    './ios/ReactNativeIgniteKit.xcodeproj/project.pbxproj',
    'utf8',
  );
  const pbxMatch = pbxContent.match(/MARKETING_VERSION\s*=\s*([^;]+);/);
  const iosVersion = pbxMatch ? pbxMatch[1].trim() : 'NOT FOUND';

  return {pkgVersion, androidVersion, iosVersion};
}

function get() {
  const {pkgVersion, androidVersion, iosVersion} = getLocalVersions();

  console.log('\n📋 Local versions:');
  console.log(`  package.json:      ${pkgVersion}`);
  console.log(`  android (gradle):  ${androidVersion}`);
  console.log(`  ios (pbxproj):     ${iosVersion}`);

  const allMatch = pkgVersion === androidVersion && androidVersion === iosVersion;
  if (allMatch) {
    console.log(`\n✅ All local versions match: ${pkgVersion}`);
  } else {
    console.log('\n❌ VERSION MISMATCH — fix before building!');
  }

  console.log('\n📡 EAS remote build numbers:');
  for (const [platform, label] of [
    ['ios', 'iOS buildNumber'],
    ['android', 'Android versionCode'],
  ]) {
    try {
      const raw = execSync(`eas build:version:get -p ${platform}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const match = raw.match(/(?:buildNumber|versionCode)\s*-\s*(\d+)/);
      console.log(
        `  ${label}:${' '.repeat(22 - label.length)}${match ? match[1] : 'unknown'}`,
      );
    } catch {
      console.log(`  ${label}:${' '.repeat(22 - label.length)}(failed to fetch)`);
    }
  }
  console.log('');
}

function check() {
  const {pkgVersion, androidVersion, iosVersion} = getLocalVersions();
  const allMatch = pkgVersion === androidVersion && androidVersion === iosVersion;

  if (!allMatch) {
    console.error('\n❌ VERSION MISMATCH — fix before building!');
    console.error(`  package.json:      ${pkgVersion}`);
    console.error(`  android (gradle):  ${androidVersion}`);
    console.error(`  ios (pbxproj):     ${iosVersion}`);
    process.exit(1);
  }

  console.log(`\n✅ All versions match: ${pkgVersion} — safe to build.\n`);
}

switch (command) {
  case 'get':
    get();
    break;
  case 'check':
    check();
    break;
  default:
    console.log('Usage: node scripts/eas-version.js <get|check>');
    process.exit(1);
}
