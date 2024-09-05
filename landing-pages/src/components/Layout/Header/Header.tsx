import {
  Filters,
  SearchHeaderLayoutContextProvider,
  SearchHeadWrapper,
} from '@doctools/components';
import { StackProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation } from '@tanstack/react-router';
import { useHeaderContext } from 'components/Layout/Header/HeaderContext';
import { useLocaleParams } from 'hooks/useLocale';
import { useMobile } from 'hooks/useMobile';
import { usePageData } from 'hooks/usePageData';
import { useCallback, useMemo } from 'react';
import { searchTypeQueryParameterName } from 'vars';
import HeaderDesktop from './Desktop/HeaderDesktop';
import HeaderMenuItems from './HeaderMenuItems';
import HeaderMobile from './Mobile/HeaderMobile';

export const headerHeight = '68px';

export const headerStyles: StackProps['sx'] = {
  position: 'relative', // for zIndex to work
  backgroundColor: 'hsl(216, 42%, 13%)',
  px: '16px',
};

export type HeaderOptions = {
  searchFilters?: Filters;
};

export default function Header() {
  const theme = useTheme();
  const { placeholder } = useLocaleParams();
  const { isMobile } = useMobile();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { pageData } = usePageData();
  const hideSearchBox = location.pathname === '/search-results';

  const defaultFilters = useMemo(() => {
    if (!pageData?.searchFilters) {
      return {};
    }
    const defaultFilters: Filters = {};
    Object.keys(pageData?.searchFilters).forEach((k) => {
      defaultFilters[k] = pageData?.searchFilters![k];
    });
    return defaultFilters;
  }, [pageData]);

  const { setHeaderOptions } = useHeaderContext();

  const updateHeaderOptions = useCallback(
    (searchFilters: Filters) => {
      setHeaderOptions((prevHeaderOptions) => ({
        ...prevHeaderOptions,
        searchFilters: searchFilters,
      }));
    },
    [setHeaderOptions]
  );

  if (smallScreen) {
    return (
      <SearchHeaderLayoutContextProvider
        defaultFilters={defaultFilters}
        setFilters={updateHeaderOptions}
      >
        <HeaderMobile
          menuContents={
            <>
              {!hideSearchBox && (
                <SearchHeadWrapper
                  placeholder={placeholder}
                  isMobile={isMobile}
                  searchTypeQueryParameterName={searchTypeQueryParameterName}
                />
              )}
              <HeaderMenuItems />
            </>
          }
        />
      </SearchHeaderLayoutContextProvider>
    );
  }

  return (
    <SearchHeaderLayoutContextProvider
      defaultFilters={defaultFilters}
      setFilters={updateHeaderOptions}
    >
      <HeaderDesktop
        centerItems={
          !hideSearchBox && (
            <>
              <SearchHeadWrapper
                placeholder={placeholder}
                isMobile={isMobile}
                searchTypeQueryParameterName={searchTypeQueryParameterName}
              />
            </>
          )
        }
        rightItems={<HeaderMenuItems />}
      />
    </SearchHeaderLayoutContextProvider>
  );
}
