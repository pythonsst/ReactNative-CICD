/**
 * Metro launcher — prints before any heavy work so terminals never look "dead".
 */
process.stdout.write('\n>>> Metro / React Native\n>>> Booting…\n');

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

process.stdout.write('>>> Project root: ' + root + '\n');

let cli;
process.stdout.write('>>> Locating react-native CLI…\n');
try {
  cli = require.resolve('react-native/cli', {paths: [root]});
} catch {
  try {
    cli = require.resolve('react-native/cli.js', {paths: [root]});
  } catch {
    cli = path.join(root, 'node_modules', 'react-native', 'cli.js');
  }
}

if (!fs.existsSync(cli)) {
  console.error(
    '\n[start] react-native CLI not found at:\n  ' + cli +
      '\nRun: yarn install\n',
  );
  process.exit(1);
}

process.stdout.write('>>> Using CLI: ' + cli + '\n');

const extra = process.argv.slice(2);
const args = ['start', '--verbose', ...extra];

process.stdout.write(
  '>>> Spawning Metro (verbose). First bundle logs can take 10–60s.\n\n',
);

// Pipe Metro output through this process so logs show up in IDEs/tools that mishandle stdio: 'inherit'.
const child = spawn(process.execPath, [cli, ...args], {
  cwd: root,
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    FORCE_COLOR: process.env.FORCE_COLOR ?? '1',
  },
});

const pipeOrInherit = (stream, dest) => {
  if (stream && dest) {
    stream.pipe(dest);
  }
};
pipeOrInherit(child.stdout, process.stdout);
pipeOrInherit(child.stderr, process.stderr);

const forwardSignal = (sig) => {
  if (!child.pid || child.killed) {
    return;
  }
  try {
    child.kill(sig);
  } catch (_) {
    /* ignore */
  }
};
process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));

child.on('spawn', () => {
  process.stderr.write(
    `>>> Metro process started (pid ${child.pid}). Verbose logs may take 30–90s on first run — do not Ctrl+C yet.\n`,
  );
});

const waitHint = setTimeout(() => {
  process.stderr.write(
    '\n[Metro] Still quiet? That is normal. Wait up to 90s. Check port: lsof -i :8081\n',
  );
}, 20000);

child.on('error', (err) => {
  clearTimeout(waitHint);
  console.error('[start] spawn failed:', err.message);
  process.exit(1);
});

child.on('close', (code, signal) => {
  clearTimeout(waitHint);
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 0);
});
