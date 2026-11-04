#!/usr/bin/env node

/**
 * Interactive EAS Update — prompts for update message and runs `eas update`.
 *
 * Usage:
 *   node scripts/eas-update.js <channel>
 *   e.g. node scripts/eas-update.js production
 *
 * Flow:
 *   1. Soft check for uncommitted changes (prompt to commit or skip)
 *   2. Prompt user for the update message
 *   3. Run `eas update --channel <channel> --message "<message>"`
 */

const readline = require('readline');
const { execSync, spawn } = require('child_process');

// ── Helpers ──────────────────────────────────────────────────

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Uncommitted changes check ────────────────────────────────

async function checkUncommittedChanges() {
  try {
    const status = execSync('git status --porcelain', {
      encoding: 'utf-8',
    }).trim();
    if (!status) return;

    console.log();
    console.log('\x1b[33m%s\x1b[0m', '  ⚠ You have uncommitted changes:');
    for (const line of status.split('\n').slice(0, 10)) {
      console.log(`    \x1b[90m${line}\x1b[0m`);
    }
    const total = status.split('\n').length;
    if (total > 10) {
      console.log(`    \x1b[90m... and ${total - 10} more\x1b[0m`);
    }
    console.log();

    const answer = await ask(
      '\x1b[33m  Would you like to commit before proceeding? (y/N): \x1b[0m',
    );
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log(
        '\x1b[36m%s\x1b[0m',
        '\n  Please commit your changes and run this command again.\n',
      );
      process.exit(1);
    }
    console.log(
      '\x1b[90m%s\x1b[0m',
      '  Skipping commit — proceeding with uncommitted changes.\n',
    );
  } catch {
    // Not a git repo or git not available — skip
  }
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const channel = process.argv[2];
  if (!channel) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '\n  Usage: node scripts/eas-update.js <channel>',
    );
    console.error(
      '  Channels: development | staging | production\n',
    );
    process.exit(1);
  }

  // 1. Uncommitted changes
  await checkUncommittedChanges();

  console.log();
  console.log(
    '\x1b[1m%s\x1b[0m',
    `  EAS Update  ·  Channel: \x1b[36m${channel}\x1b[0m`,
  );
  console.log();

  // 2. Prompt for message
  const message = await ask(
    '\x1b[33m  Enter update message: \x1b[0m',
  );

  if (!message) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '\n  No message provided. Aborting.\n',
    );
    process.exit(1);
  }

  // 4. Confirm
  console.log();
  console.log('\x1b[1m%s\x1b[0m', '  Will publish OTA update:');
  console.log(`    Channel: \x1b[36m${channel}\x1b[0m`);
  console.log(`    Message: \x1b[36m${message}\x1b[0m`);
  console.log();

  const confirm = await ask(
    '\x1b[33m  Proceed? (y/N): \x1b[0m',
  );
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('\x1b[31m%s\x1b[0m', '\n  Cancelled.\n');
    process.exit(1);
  }

  // 5. Run eas update
  console.log('\x1b[32m%s\x1b[0m', '\n  Running eas update...\n');

  const child = spawn(
    'eas',
    ['update', '--channel', channel, '--message', message],
    { stdio: 'inherit' },
  );

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
}

main();
