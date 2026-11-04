#!/usr/bin/env node

/**
 * Syncs WHATS_NEW.txt to both iOS and Android metadata directories
 * for EAS Submit to pick up automatically.
 *
 * Usage: node scripts/sync-release-notes.js
 *
 * - iOS App Store: 4,000 character limit (release_notes.txt)
 * - Google Play Store: 500 character limit (changelogs/default.txt)
 *
 * If your notes exceed 500 chars, the script auto-trims for Android
 * (keeps complete bullet points that fit) and warns you.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'WHATS_NEW.txt');

const IOS_DIR = path.join(ROOT, 'ios', 'fastlane', 'metadata', 'en-US');
const IOS_FILE = path.join(IOS_DIR, 'release_notes.txt');

const ANDROID_DIR = path.join(
  ROOT,
  'android',
  'fastlane',
  'metadata',
  'android',
  'en-US',
  'changelogs',
);
const ANDROID_FILE = path.join(ANDROID_DIR, 'default.txt');

const PLAY_STORE_LIMIT = 500;
const APP_STORE_LIMIT = 4000;

// ── Helpers ──────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Smart-trim for Play Store: keeps complete lines/bullets that fit
 * within the character limit.
 */
function trimForPlayStore(text) {
  if (text.length <= PLAY_STORE_LIMIT) return text;

  const lines = text.split('\n');
  const kept = [];
  let length = 0;

  for (const line of lines) {
    // +1 for the newline character we'll add back
    const addition = kept.length === 0 ? line.length : line.length + 1;
    if (length + addition > PLAY_STORE_LIMIT) break;
    kept.push(line);
    length += addition;
  }

  return kept.join('\n').trim();
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠ WHATS_NEW.txt not found at project root. Skipping release notes sync.');
    return;
  }

  const notes = fs.readFileSync(SOURCE, 'utf-8').trim();

  if (!notes) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠ WHATS_NEW.txt is empty. Skipping release notes sync.');
    return;
  }

  console.log('\x1b[36m%s\x1b[0m', '── Release Notes ──────────────────────────');
  console.log(notes);
  console.log('\x1b[36m%s\x1b[0m', '────────────────────────────────────────────');
  console.log(`  Length: ${notes.length} characters\n`);

  // ── iOS (App Store) ──
  if (notes.length > APP_STORE_LIMIT) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `⚠ Notes exceed App Store limit (${notes.length}/${APP_STORE_LIMIT} chars). Truncating.`,
    );
  }
  ensureDir(IOS_DIR);
  fs.writeFileSync(IOS_FILE, notes.slice(0, APP_STORE_LIMIT) + '\n', 'utf-8');
  console.log('\x1b[32m%s\x1b[0m', `✓ iOS  → ${path.relative(ROOT, IOS_FILE)}`);

  // ── Android (Play Store) ──
  const androidNotes = trimForPlayStore(notes);
  const wasTrimmed = androidNotes.length < notes.length;

  ensureDir(ANDROID_DIR);
  fs.writeFileSync(ANDROID_FILE, androidNotes + '\n', 'utf-8');
  console.log('\x1b[32m%s\x1b[0m', `✓ Android → ${path.relative(ROOT, ANDROID_FILE)}`);

  if (wasTrimmed) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `\n⚠ Android notes trimmed to ${androidNotes.length}/${PLAY_STORE_LIMIT} chars (Play Store limit).`,
    );
    console.log('  Kept complete bullet points that fit. Dropped:');
    const keptLines = new Set(androidNotes.split('\n'));
    const allLines = notes.split('\n');
    for (const line of allLines) {
      if (!keptLines.has(line) && line.trim()) {
        console.log(`    \x1b[31m- ${line.trim()}\x1b[0m`);
      }
    }
  }

  console.log('\n\x1b[32m%s\x1b[0m', 'Done! Release notes synced for both platforms.');
  console.log('Run \x1b[36meas submit\x1b[0m and they will be picked up automatically.\n');
}

main();
