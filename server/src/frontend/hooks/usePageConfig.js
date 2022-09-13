import { useState, useEffect } from 'react';

export function usePageConfig(pagePath) {
  const [pageConfig, setPageConfig] = useState();
  useEffect(function() {
    async function fetchConfig() {
      const controller = new AbortController();
      const signal = controller.signal;
      const result = await fetch(`/pages${pagePath}/index.json`, { signal });
      if (result.ok) {
        const config = await result.json();
        setPageConfig(config);
      }

      return () => {
        controller.abort();
      };
    }

    fetchConfig();
  }, []);

  return [pageConfig, setPageConfig];
}
