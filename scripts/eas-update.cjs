#!/usr/bin/env node

const {spawnSync} = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const channel = process.argv[2];
const cliMessage = process.argv.slice(3).join(' ').trim();
const envMessage = (process.env.MESSAGE || '').trim();
const hasInteractiveInput = process.stdin.isTTY && !process.env.CI;

if (!channel) {
  console.error('[eas-update] Missing channel.');
  console.error(
    '[eas-update] Usage: node scripts/eas-update.cjs <development|staging|production> [message]',
  );
  process.exit(1);
}

const root = path.join(__dirname, '..');
const easBin = path.join(root, 'node_modules', 'eas-cli', 'bin', 'run');
if (!fs.existsSync(easBin)) {
  console.error('[eas-update] eas-cli not found. Run: yarn install');
  process.exit(1);
}

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const deps = {
  ...(pkg.dependencies || {}),
  ...(pkg.devDependencies || {}),
};
const hasExpoPackage = Boolean(deps.expo);
const hasExpoUpdates = Boolean(deps['expo-updates']);

if (!hasExpoPackage || !hasExpoUpdates) {
  console.error(
    '[eas-update] EAS Update requires Expo modules (`expo` and `expo-updates`).',
  );
  console.error(
    '[eas-update] This repo currently looks like bare React Native without OTA wiring.',
  );
  console.error('\nTo enable OTA updates in this project:');
  console.error('  1) npx install-expo-modules@latest');
  console.error('  2) npx expo install expo-updates');
  console.error('  3) Configure native setup per docs, then re-run eas:update');
  console.error(
    '\nIf you do not want OTA updates, use eas:build + eas:submit flows instead.',
  );
  process.exit(1);
}

const runUpdate = (message) => {
  const result = spawnSync(
    process.execPath,
    [easBin, 'update', '--channel', channel, '--message', message],
    {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    },
  );
  process.exit(result.status ?? 1);
};

const providedMessage = cliMessage || envMessage;
if (providedMessage) {
  runUpdate(providedMessage);
}

if (!hasInteractiveInput) {
  console.error('[eas-update] Missing update message.');
  console.error(
    `[eas-update] Provide it as:\n  yarn eas:update:${channel} -- "Describe this update"\n  or\n  MESSAGE="Describe this update" yarn eas:update:${channel}`,
  );
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Please enter your OTA update message: ', (answer) => {
  const message = (answer || '').trim();
  rl.close();
  if (!message) {
    console.error('[eas-update] Update message cannot be empty.');
    process.exit(1);
  }
  runUpdate(message);
});
