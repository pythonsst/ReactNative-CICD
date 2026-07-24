module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    'react-native-config': '<rootDir>/__mocks__/react-native-config.js',
  },
};
