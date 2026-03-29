/**
 * EAS app config (bare React Native — no `expo` app package required).
 *
 * Used by: `eas build`, `eas submit`, `eas update` (reads this + eas.json).
 * Not used by: Metro, `react-native start`, or local Gradle/Xcode (those use native projects).
 *
 * ─── ONE-TIME SETUP ─────────────────────────────────────────────────────────
 *  1. npm install -g eas-cli
 *  2. eas login
 *  3. eas init          ← auto-fills owner + projectId below
 *  4. Replace YOUR_APP_STORE_APP_ID in eas.json with your App Store numeric ID
 *  5. Add EXPO_TOKEN secret to your GitHub repo settings
 * ────────────────────────────────────────────────────────────────────────────
 */

const pkg = require('./package.json');

// Resolved from eas.json `env.APP_ENV` at build time, or locally from the shell.
// Falls back to 'development' so local runs always work.
const appEnv = (process.env.APP_ENV || 'development').toLowerCase();

const envConfig = {
  development: {
    appName: 'IgniteKit Dev',
  },
  staging: {
    appName: 'IgniteKit Staging',
  },
  production: {
    appName: 'IgniteKit',
  },
};

const { appName } = envConfig[appEnv] ?? envConfig.development;

module.exports = {
  name: appName,
  slug: 'reactnativeignitekit',

  // Kept in sync with package.json — run `yarn eas:version:get` to verify
  version: pkg.version,

  // OTA updates: clients only receive updates built with the same runtimeVersion.
  // 'appVersion' policy ties runtimeVersion to the native app version automatically.
  runtimeVersion: '1.0.0',
  updates: {
    url: 'https://u.expo.dev/81e7f11f-c57a-420e-ae2a-b564c882828a',
  },

  // ─── FILL IN AFTER RUNNING `eas init` ───────────────────────────────────
  owner: 'shivtiwari',
  extra: {
    eas: {
      projectId: '81e7f11f-c57a-420e-ae2a-b564c882828a',
    },
    appEnv,
  },
  // ────────────────────────────────────────────────────────────────────────

  android: {
    package: 'com.shivshankartiwari.reactnativeignitekit',
  },
  ios: {
    bundleIdentifier: 'com.educatorslabs.ignitekit',
  },
};
