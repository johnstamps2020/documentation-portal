import { EnvInfo } from '../types/env';

export function getEnvInfo(): EnvInfo {
  try {
    return { name: process.env.DEPLOY_ENV };
  } catch (err) {
    return { name: null };
  }
}
