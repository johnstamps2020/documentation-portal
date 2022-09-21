import { useState, useEffect } from 'react';
import type { PageConfig } from '../../model/entity/PageConfig';
import { setFromApi } from './utils';

export function usePageConfig(pagePath: string) {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>();
  useEffect(function() {

    setFromApi(`/pages${pagePath}/index.json`, setPageConfig);
  }, []);

  return [pageConfig, setPageConfig] as const;
}
