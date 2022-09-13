import { useEffect, useState } from 'react';
import { EnvProps } from '../../../types/config';
import { setFromApi } from './utils';

export function useEnv() {
  const [env, setEnv] = useState<EnvProps | undefined>();

  useEffect(function() {
    setFromApi('/safeConfig/env', setEnv);
  }, []);

  return [env, setEnv] as const;
}
