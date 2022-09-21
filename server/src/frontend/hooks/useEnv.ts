import { useEffect, useState } from 'react';
import { Environment } from '../../types/environment';
import { setFromApi } from './utils';

export function useEnv() {
  const [env, setEnv] = useState<Environment | undefined>();

  useEffect(function() {
    setFromApi('/safeConfig/env', setEnv);
  }, []);

  return [env, setEnv] as const;
}
