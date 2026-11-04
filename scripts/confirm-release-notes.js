#!/usr/bin/env node

/**
 * Pre-flight check: shows WHATS_NEW.txt and asks the developer
 * to confirm it's up-to-date before proceeding with EAS commands.
 *
 * Usage: node scripts/confirm-release-notes.js
 * Exits 0 if confirmed, 1 if cancelled or file missing/empty.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const SOURCE = path.join(__dirname, '..', 'WHATS_NEW.txt');

function getLastModified() {
  const stat = fs.statSync(SOURCE);
  const mtime = stat.mtime;
  const now = new Date();
  const diffMs = now - mtime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const timestamp = mtime.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let ago;
  if (diffMins < 1) ago = 'just now';
  else if (diffMins < 60) ago = `${diffMins}m ago`;
  else if (diffHours < 24) ago = `${diffHours}h ago`;
  else ago = `${diffDays}d ago`;

  return { timestamp, ago };
}

function checkUncommittedChanges() {
  return new Promise((resolve) => {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
      if (!status) return resolve();

      console.log();
      console.log(
        '\x1b[33m%s\x1b[0m',
        '  ⚠ You have uncommitted changes:',
      );
      for (const line of status.split('\n').slice(0, 10)) {
        console.log(`    \x1b[90m${line}\x1b[0m`);
      }
      const total = status.split('\n').length;
      if (total > 10) {
        console.log(`    \x1b[90m... and ${total - 10} more\x1b[0m`);
      }
      console.log();

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        '\x1b[33m  Would you like to commit before proceeding? (y/N): \x1b[0m',
        (answer) => {
          rl.close();
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            console.log(
              '\x1b[36m%s\x1b[0m',
              '\n  Please commit your changes and run this command again.\n',
            );
            process.exit(1);
          } else {
            console.log(
              '\x1b[90m%s\x1b[0m',
              '  Skipping commit — proceeding with uncommitted changes.\n',
            );
            resolve();
          }
        },
      );
    } catch {
      // Not a git repo or git not available — skip check
      resolve();
    }
  });
}

async function main() {
  // ── Check uncommitted changes ──
  await checkUncommittedChanges();

  // ── Check file exists ──
  if (!fs.existsSync(SOURCE)) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '\n✗ WHATS_NEW.txt not found at project root.',
    );
    console.error('  Create it before running EAS commands.\n');
    process.exit(1);
  }

  const notes = fs.readFileSync(SOURCE, 'utf-8').trim();

  if (!notes) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      '\n✗ WHATS_NEW.txt is empty.',
    );
    console.error('  Add release notes before running EAS commands.\n');
    process.exit(1);
  }

  // ── Show notes ──
  const { timestamp, ago } = getLastModified();

  console.log();
  console.log(
    '\x1b[1m%s\x1b[0m',
    '  This will be used as the EAS update message and App Store / Play Store "What\'s New" text.',
  );
  console.log();
  console.log(
    '\x1b[36m%s\x1b[0m',
    '┌─── WHATS_NEW.txt ────────────────────────',
  );
  for (const line of notes.split('\n')) {
    console.log('\x1b[36m│\x1b[0m ' + line);
  }
  console.log(
    '\x1b[36m%s\x1b[0m',
    '└───────────────────────────────────────────────',
  );
  const PLAY_STORE_LIMIT = 500;
  const APP_STORE_LIMIT = 4000;

  const playOk = notes.length <= PLAY_STORE_LIMIT;
  const appOk = notes.length <= APP_STORE_LIMIT;

  const playStatus = playOk
    ? `\x1b[32m✓ Play Store: ${notes.length}/${PLAY_STORE_LIMIT}\x1b[0m`
    : `\x1b[31m✗ Play Store: ${notes.length}/${PLAY_STORE_LIMIT} (will be trimmed)\x1b[0m`;
  const appStatus = appOk
    ? `\x1b[32m✓ App Store: ${notes.length}/${APP_STORE_LIMIT}\x1b[0m`
    : `\x1b[31m✗ App Store: ${notes.length}/${APP_STORE_LIMIT} (will be truncated)\x1b[0m`;

  console.log(`  ${playStatus}  ${appStatus}  \x1b[90m·  Last modified: ${timestamp} (${ago})\x1b[0m\n`);

  // ── Ask for confirmation ──
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    '\x1b[33mAre these release notes up-to-date and correct? (y/N): \x1b[0m',
    (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\x1b[32m%s\x1b[0m', '✓ Confirmed. Proceeding...\n');
        process.exit(0);
      } else {
        console.log(
          '\x1b[31m%s\x1b[0m',
          '\n✗ Cancelled. Update WHATS_NEW.txt and try again.\n',
        );
        process.exit(1);
      }
    },
  );
}

main();
