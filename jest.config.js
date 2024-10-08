// jest.config.js
export default {
    testEnvironment: 'node', // Use Node.js environment for tests
    transform: {
      // Use Babel to transpile your test files
      '^.+\\.js$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/'], // Ignore these paths
    moduleFileExtensions: ['js', 'json', 'node'], // File extensions Jest will look for
  };
  