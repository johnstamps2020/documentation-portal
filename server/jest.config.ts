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
    '^.+\\.tsx?$': 'ts-jest',
  }
};

export default config;
