/* eslint-env jest */

// Persisted drafts live in AsyncStorage — use the official in-memory mock.
jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Safe-area context relies on a native module — provide a minimal JS mock.
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  const frame = {x: 0, y: 0, width: 320, height: 640};
  const passthrough = ({children}) => React.createElement(React.Fragment, null, children);
  return {
    SafeAreaProvider: passthrough,
    SafeAreaView: props =>
      React.createElement('SafeAreaView', props, props.children),
    SafeAreaInsetsContext: React.createContext(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {insets: inset, frame},
  };
});

// The preview renders local HTML in a WebView; stub it out under test.
jest.mock('react-native-webview', () => {
  const React = require('react');
  return {WebView: props => React.createElement('WebView', props)};
});

// Native-only Expo modules — provide no-op JS stubs for the test runtime.
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(async () => ({uri: 'file:///mock.pdf'})),
  printAsync: jest.fn(async () => {}),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => {}),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({granted: true})),
  getMediaLibraryPermissionsAsync: jest.fn(async () => ({
    granted: true,
    canAskAgain: true,
  })),
  launchImageLibraryAsync: jest.fn(async () => ({canceled: true, assets: []})),
}));
