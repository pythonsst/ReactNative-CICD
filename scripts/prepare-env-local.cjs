#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const profile = (process.env.EAS_BUILD_PROFILE || '').trim().toLowerCase();

if (!profile || !['development', 'staging', 'production'].includes(profile)) {
  process.exit(0);
}

const profileKeyName = `GOOGLE_MAPS_API_KEY_${profile.toUpperCase()}`;
const injectedKey = (process.env[profileKeyName] || process.env.GOOGLE_MAPS_API_KEY || '').trim();

if (!injectedKey) {
  process.exit(0);
}

const baseEnvPath = path.join(root, `.env.${profile}`);
const localEnvPath = path.join(root, `.env.${profile}.local`);

let lines = [];
if (fs.existsSync(baseEnvPath)) {
  lines = fs.readFileSync(baseEnvPath, 'utf8').split(/\r?\n/);
}

let found = false;
const updated = lines.map(line => {
  if (line.startsWith('GOOGLE_MAPS_API_KEY=')) {
    found = true;
    return `GOOGLE_MAPS_API_KEY=${injectedKey}`;
  }
  return line;
});

if (!found) {
  updated.push(`GOOGLE_MAPS_API_KEY=${injectedKey}`);
}

const content = updated.filter(Boolean).join('\n') + '\n';
fs.writeFileSync(localEnvPath, content, 'utf8');

console.log(`[prepare-env-local] Wrote ${path.basename(localEnvPath)} using ${profileKeyName}.`);
