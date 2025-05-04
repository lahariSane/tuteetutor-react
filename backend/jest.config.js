// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {}, // Leave this empty if you're not using Babel or TS
  moduleNameMapper: {},
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
};
