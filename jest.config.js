module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    'react-native-config': '<rootDir>/__mocks__/react-native-config.js',
    'expo-linear-gradient': '<rootDir>/__mocks__/expo-linear-gradient.js',
    'expo-haptics': '<rootDir>/__mocks__/expo-haptics.js',
  },
};
