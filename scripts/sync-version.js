#!/usr/bin/env node

/**
 * Syncs the app version from package.json to all other files.
 * (Ported from the Agastya app's scripts/sync-version.js.)
 *
 * Single source of truth: package.json "version"
 *
 * Syncs to:
 *   - android/app/build.gradle   → versionName
 *   - android/.../strings.xml    → expo_runtime_version
 *   - ios/.../Expo.plist         → EXUpdatesRuntimeVersion
 *   - ios/*.xcodeproj            → MARKETING_VERSION
 *
 * app.config.js reads version and runtimeVersion from package.json directly.
 *
 * The OTA runtime version follows the app version, so an OTA published from
 * a release only reaches binaries of that same release — never an older
 * binary that may lack the native modules its JS needs.
 *
 * Usage:
 *   yarn version:bump 1.0.1     # bump to 1.0.1, then sync
 *   yarn version:sync           # re-sync the current package.json version
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PACKAGE_JSON = path.join(ROOT, 'package.json');
const BUILD_GRADLE = path.join(ROOT, 'android', 'app', 'build.gradle');
const STRINGS_XML = path.join(ROOT, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
const EXPO_PLIST = path.join(ROOT, 'ios', 'ReactNativeIgniteKit', 'Supporting', 'Expo.plist');
const PBXPROJ = path.join(ROOT, 'ios', 'ReactNativeIgniteKit.xcodeproj', 'project.pbxproj');

// ── Helpers ──────────────────────────────────────────────────────────

function isValidSemver(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

// Replace in a file, failing loudly if the pattern is missing so a renamed
// file or key can't silently leave one platform on the old version.
function replaceInFile(filePath, pattern, replacement, label) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!pattern.test(content)) {
    console.error('\x1b[31m%s\x1b[0m', `✗ ${label}: pattern not found in ${path.relative(ROOT, filePath)}`);
    process.exit(1);
  }
  pattern.lastIndex = 0;
  fs.writeFileSync(filePath, content.replace(pattern, replacement), 'utf-8');
  console.log('\x1b[32m%s\x1b[0m', `✓ ${label}`);
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  const newVersion = process.argv[2];
  const raw = fs.readFileSync(PACKAGE_JSON, 'utf-8');
  const pkg = JSON.parse(raw);

  // If a version argument was passed, update package.json first
  if (newVersion) {
    if (!isValidSemver(newVersion)) {
      console.error('\x1b[31m%s\x1b[0m', `✗ Invalid version: "${newVersion}". Use semver format (e.g. 1.0.1)`);
      process.exit(1);
    }
    // Targeted replace keeps package.json formatting/key order untouched.
    fs.writeFileSync(
      PACKAGE_JSON,
      raw.replace(/("version":\s*")[^"]+(")/, `$1${newVersion}$2`),
      'utf-8',
    );
    pkg.version = newVersion;
    console.log('\x1b[32m%s\x1b[0m', `✓ package.json → ${newVersion}`);
  }

  const version = pkg.version;
  console.log(`\n  Syncing version: \x1b[36m${version}\x1b[0m\n`);

  replaceInFile(
    BUILD_GRADLE,
    /versionName\s+"[\d.]+"/,
    `versionName "${version}"`,
    'android/app/build.gradle → versionName',
  );

  replaceInFile(
    STRINGS_XML,
    /(<string name="expo_runtime_version">)[\d.]+(<\/string>)/,
    `$1${version}$2`,
    'android strings.xml → expo_runtime_version',
  );

  replaceInFile(
    EXPO_PLIST,
    /(<key>EXUpdatesRuntimeVersion<\/key>\s*<string>)[\d.]+(<\/string>)/,
    `$1${version}$2`,
    'ios Expo.plist → EXUpdatesRuntimeVersion',
  );

  replaceInFile(
    PBXPROJ,
    /MARKETING_VERSION = [\d.]+;/g,
    `MARKETING_VERSION = ${version};`,
    'project.pbxproj → MARKETING_VERSION',
  );

  console.log('\n\x1b[32m%s\x1b[0m', `Done! All files now at v${version}`);
}

main();
