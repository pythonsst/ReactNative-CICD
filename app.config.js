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

module.exports = {
  name: 'ReactNativeIgniteKit',
  slug: 'reactnativeignitekit',

  // Kept in sync with package.json — run `yarn eas:version:get` to verify
  version: pkg.version,

  // OTA updates: clients only receive updates built with the same runtimeVersion.
  // 'appVersion' policy ties runtimeVersion to the native app version automatically.
  // runtimeVersion and updates are enabled once expo-updates is installed.
  // Run: npx expo install expo-updates && npx eas update:configure
  // runtimeVersion: { policy: 'appVersion' },

  // ─── FILL IN AFTER RUNNING `eas init` ───────────────────────────────────
  owner: 'shivtiwari',
  extra: {
    eas: {
      projectId: '81e7f11f-c57a-420e-ae2a-b564c882828a',
    },
  },
  // ────────────────────────────────────────────────────────────────────────

  android: {
    package: 'com.shivshankartiwari.reactnativeignitekit',
  },
  ios: {
    bundleIdentifier: 'com.shivshankartiwari.reactnativeignitekit',
  },
};
