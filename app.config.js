/**
 * EAS app config (bare workflow).
 *
 * This file is only used by EAS Build / EAS Update — it is NOT used by the
 * Metro bundler or react-native CLI at dev time.
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

const projectId = 'ca1367f7-7e15-4ec7-af34-2bf2cca2fa0b';

module.exports = {
  name: 'SnapBiodata',
  slug: 'snapbiodata',

  // Kept in sync with package.json — run `yarn eas:version:get` to verify
  version: pkg.version,

  owner: 'agastyaai',

  runtimeVersion: '1.0.0',

  plugins: ['expo-updates'],

  updates: {
    url: `https://u.expo.dev/${projectId}`,
  },

  extra: {
    eas: {
      projectId,
    },
  },

  android: {
    package: 'com.snapbiodata.app',
  },
  ios: {
    bundleIdentifier: 'com.snapbiodata.app',
  },
};
