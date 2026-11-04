module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    'react-native-config': '<rootDir>/__mocks__/react-native-config.js',
    '^expo-updates$': '<rootDir>/__mocks__/expo-updates.js',
    '^sp-react-native-in-app-updates$':
      '<rootDir>/__mocks__/sp-react-native-in-app-updates.js',
  },
};
