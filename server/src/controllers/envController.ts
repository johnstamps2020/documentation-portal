import { EnvInfo, EnvName } from '@doctools/components';

export function getEnvInfo(): EnvInfo {
  try {
    return { name: process.env.DEPLOY_ENV as EnvName };
  } catch (err) {
    return { name: null };
  }
}
