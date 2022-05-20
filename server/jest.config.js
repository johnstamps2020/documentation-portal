/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testTimeout: 13006,
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  displayName: {
    name: 'DOCUMENTATION PORTAL',
    color: 'magenta',
  },
};

module.exports = config;
