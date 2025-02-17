import { EnvInfo, EnvName } from '@doctools/core';
import 'dotenv/config';

export function getEnvInfo(): EnvInfo {
  try {
    return { name: process.env.DEPLOY_ENV as EnvName };
  } catch (err) {
    return { name: null };
  }
}
