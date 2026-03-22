#!/usr/bin/env node

/**
 * Submit the latest finished Android build for a specific EAS build profile.
 *
 * Why this exists:
 * `eas submit --latest` picks the latest build for the platform, regardless of
 * which build profile produced it. That can accidentally submit a development
 * artifact to staging/production tracks.
 */
const {execFileSync, spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const profile = process.argv[2];
const allowedProfiles = new Set(['development', 'staging', 'production']);

if (!allowedProfiles.has(profile)) {
  console.error(
    '[eas-submit] Usage: node scripts/eas-submit-by-profile.js <development|staging|production>',
  );
  process.exit(1);
}

const root = path.join(__dirname, '..');
const easBin = path.join(root, 'node_modules', 'eas-cli', 'bin', 'run');
if (!fs.existsSync(easBin)) {
  console.error('[eas-submit] eas-cli not found. Run: yarn install');
  process.exit(1);
}

const listArgs = [
  'build:list',
  '--platform',
  'android',
  '--status',
  'finished',
  '--build-profile',
  profile,
  '--limit',
  '1',
  '--json',
  '--non-interactive',
];

let latestBuild;
try {
  const raw = execFileSync(process.execPath, [easBin, ...listArgs], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    console.error(
      `[eas-submit] No finished Android build found for profile "${profile}". Build first.`,
    );
    process.exit(1);
  }
  latestBuild = parsed[0];
} catch (err) {
  console.error('[eas-submit] Failed to fetch build list.');
  if (err && err.message) {
    console.error(err.message);
  }
  process.exit(1);
}

if (!latestBuild?.id) {
  console.error('[eas-submit] Could not resolve build id from EAS response.');
  process.exit(1);
}

console.log(
  `[eas-submit] Submitting Android build ${latestBuild.id} from profile "${profile}"...`,
);

const submitArgs = [
  easBin,
  'submit',
  '--platform',
  'android',
  '--profile',
  profile,
  '--id',
  latestBuild.id,
];

// Keep interactive behavior locally; force non-interactive in CI.
if (process.env.CI) {
  submitArgs.push('--non-interactive');
}

const result = spawnSync(process.execPath, submitArgs, {
  cwd: root,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
