import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testTimeout: 13006,
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  displayName: {
    name: 'DOCUMENTATION PORTAL',
    color: 'magenta',
  },
  transform: {
    '^.+\\.ts[x]*?$': 'ts-jest',
  },
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "uuid": require.resolve('uuid'),
  }
};

export default config;
