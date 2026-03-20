/**
 * Explicit app config for EAS Update (bare workflow).
 * Ensures runtimeVersion is correctly read during `eas update` bundling.
 * Channel is set in eas.json and injected at build time.
 *
 * Run `eas init` to link this project to your EAS account and
 * populate the projectId below.
 */
const appJson = require('./app.json');

module.exports = {
  name: appJson.name,
  slug: 'reactnativeignitekit',
  version: '0.0.1',
  runtimeVersion: {
    policy: 'appVersion',
  },
  owner: 'YOUR_EXPO_ACCOUNT',
  extra: {
    eas: {
      projectId: 'YOUR_EAS_PROJECT_ID',
    },
  },
  updates: {
    url: 'https://u.expo.dev/YOUR_EAS_PROJECT_ID',
  },
  android: {
    package: 'com.validus.ignitekit',
  },
  ios: {
    bundleIdentifier: 'com.validus.ignitekit',
  },
};
