/**
 * Register Lefthook Git hooks.
 * Mirrors lefthook's postinstall CI skip: no hooks on CI unless LEFTHOOK is set.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const bestEffort = process.argv.includes('--best-effort');

const isEnabled = (value) => value && value !== '0' && value !== 'false';
// Only skip in real CI (no TTY). Some IDEs set CI=true in dev terminals — still install hooks there.
const skipBecauseCi =
  isEnabled(process.env.CI) &&
  !isEnabled(process.env.LEFTHOOK) &&
  !process.stdout.isTTY;
if (skipBecauseCi) {
  console.log(
    '[lefthook-install] Skipping on CI (set LEFTHOOK=1 to force hooks in CI).',
  );
  process.exit(0);
}

const root = path.join(__dirname, '..');
const lefthookPkg = path.join(root, 'node_modules', 'lefthook');

if (!fs.existsSync(lefthookPkg)) {
  console.warn('[lefthook-install] Run `yarn install` first (lefthook missing).');
  process.exit(bestEffort ? 0 : 1);
}

let lefthookExe;
try {
  // Native binary from optional dependency (e.g. lefthook-darwin-arm64)
  const { getExePath } = require(path.join(lefthookPkg, 'get-exe.js'));
  lefthookExe = getExePath();
} catch (e) {
  console.warn(
    '[lefthook-install] Lefthook binary missing. Try: yarn install\n',
    e.message,
  );
  process.exit(bestEffort ? 0 : 1);
}

console.log('[lefthook-install] Installing Git hooks (lefthook install -f)...');

const TIMEOUT_MS = 120000;
try {
  execFileSync(lefthookExe, ['install', '-f'], {
    cwd: root,
    stdio: ['ignore', 'inherit', 'inherit'],
    timeout: TIMEOUT_MS,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
} catch (err) {
  if (err.code === 'ETIMEDOUT' || err.signal === 'SIGTERM') {
    console.error(
      `[lefthook-install] Timed out after ${TIMEOUT_MS / 1000}s. Check .git access and close other git processes.`,
    );
    process.exit(bestEffort ? 0 : 1);
  }
  const status = typeof err.status === 'number' ? err.status : 1;
  if (status !== 0 && bestEffort) {
    console.warn(
      '[lefthook-install] Failed. Run manually: yarn lefthook:install',
    );
    process.exit(0);
  }
  process.exit(status);
}

console.log('[lefthook-install] Done.');
process.exit(0);
