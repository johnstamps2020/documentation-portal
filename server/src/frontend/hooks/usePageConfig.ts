import { useState, useEffect } from 'react';
import type { Page } from '../../../types/page';
import { setFromApi } from './utils';

export function usePageConfig(pagePath: string) {
  const [pageConfig, setPageConfig] = useState<Page | null>();
  useEffect(function() {

    setFromApi(`/pages${pagePath}/index.json`, setPageConfig);
  }, []);

  return [pageConfig, setPageConfig] as const;
}
