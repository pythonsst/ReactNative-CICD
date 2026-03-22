/**
 * Run ESLint only when Lefthook passes staged files (avoids `eslint` with no args = whole repo).
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = process.argv.slice(2).filter((f) => {
  if (!f) return false;
  const abs = path.isAbsolute(f) ? f : path.join(root, f);
  return fs.existsSync(abs);
});

if (files.length === 0) {
  process.exit(0);
}

const eslintBin = path.join(root, 'node_modules', '.bin', 'eslint');
if (!fs.existsSync(eslintBin)) {
  console.warn('[eslint-staged] eslint not found. Run: yarn install');
  process.exit(0);
}

execFileSync(eslintBin, files, { cwd: root, stdio: 'inherit' });
