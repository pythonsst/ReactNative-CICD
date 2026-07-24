module.exports = {
  // `babel-preset-expo` wraps the React Native preset and adds the transforms
  // Expo modules require (notably inlining `process.env.EXPO_OS`). Without it,
  // expo-modules-core fails to initialise and native modules like expo-print /
  // expo-image-picker break at load.
  presets: ['babel-preset-expo'],
};
