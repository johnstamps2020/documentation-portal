import { useLayoutContext } from 'LayoutContext';
import { LandingPageLayoutProps } from 'pages/LandingPage/LandingPageTypes';
import { useEffect } from 'react';

export function usePageSearchFilters(
  searchFilters: LandingPageLayoutProps['searchFilters']
): void {
  const { setHeaderOptions, headerOptions } = useLayoutContext();

  useEffect(() => {
    if (searchFilters && headerOptions.searchFilters !== searchFilters) {
      setHeaderOptions((currentHeaderOptions) => ({
        ...currentHeaderOptions,
        searchFilters,
      }));
    }
  }, [searchFilters, setHeaderOptions, headerOptions.searchFilters]);
}
