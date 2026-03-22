#!/usr/bin/env node

const {spawnSync} = require('child_process');

const blockedPathPatterns = [
  /(^|\/)\.env\.signing$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)google-services\.json$/i,
  /(^|\/)google-service-info\.plist$/i,
  /(^|\/).*\.p12$/i,
  /(^|\/).*\.pem$/i,
  /(^|\/).*\.jks$/i,
  /(^|\/).*\.keystore$/i,
];

const secretLinePatterns = [
  /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/,
  /AIza[0-9A-Za-z\-_]{35}/,
  /AKIA[0-9A-Z]{16}/,
  /ASIA[0-9A-Z]{16}/,
  /xox[baprs]-[0-9A-Za-z-]+/,
  /ghp_[A-Za-z0-9]{36}/,
  /\b(EXPO_TOKEN|ANDROID_SIGNING_KEY|ANDROID_KEYSTORE_PASSWORD|ANDROID_KEY_PASSWORD|ANDROID_SERVICE_ACCOUNT)\s*=/,
];

function runGit(args) {
  const result = spawnSync('git', args, {encoding: 'utf8'});
  if (result.status !== 0) {
    console.error('[secret-scan] Failed to run git command:', args.join(' '));
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
  return result.stdout;
}

const changedFiles = runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

const blockedPaths = changedFiles.filter(filePath =>
  blockedPathPatterns.some(pattern => pattern.test(filePath)),
);

if (blockedPaths.length > 0) {
  console.error('[secret-scan] Blocked sensitive files detected in staged changes:');
  for (const filePath of blockedPaths) {
    console.error(`  - ${filePath}`);
  }
  console.error('[secret-scan] Remove these files from git and keep them in local/CI secret stores.');
  process.exit(1);
}

const stagedPatch = runGit(['diff', '--cached', '-U0', '--no-color']);
const addedLines = stagedPatch
  .split('\n')
  .filter(line => line.startsWith('+') && !line.startsWith('+++'));

const findings = [];
for (const line of addedLines) {
  for (const pattern of secretLinePatterns) {
    if (pattern.test(line)) {
      findings.push(line);
      break;
    }
  }
}

if (findings.length > 0) {
  console.error('[secret-scan] Potential secrets detected in staged additions:');
  findings.slice(0, 10).forEach(item => console.error(`  - ${item}`));
  if (findings.length > 10) {
    console.error(`  ... and ${findings.length - 10} more`);
  }
  console.error('[secret-scan] Move sensitive values to EAS/GitHub/local secret stores.');
  process.exit(1);
}

process.exit(0);
