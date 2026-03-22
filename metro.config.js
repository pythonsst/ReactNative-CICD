const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
// Only pin Metro port when env is set (CLI `--port` stays the default source of truth otherwise).
const envPort = Number(process.env.RCT_METRO_PORT || process.env.METRO_PORT);
const config =
  Number.isFinite(envPort) && envPort > 0 ? {server: {port: envPort}} : {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
