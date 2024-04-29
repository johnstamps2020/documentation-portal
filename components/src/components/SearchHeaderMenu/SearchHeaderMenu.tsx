// TODO translate strings
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import {
  Filters,
  useSearchHeaderLayoutContext,
} from './SearchHeaderLayoutContext';
import { SearchHeaderMenuItem } from './SearchHeaderMenuItem';
import { SearchHeaderMenuFilterGrid } from './SearchHeaderMenuFilterGrid';

const isFiltersMatchingProductReleaseOnly = (
  searchFilters: Filters,
  defaultFilters: Filters
): boolean => {
  if (!isFiltersMatchingProductRelease(searchFilters, defaultFilters)) {
    return false;
  }
  if (isFiltersIncludeThisDoc(searchFilters)) {
    return false;
  }
  return true;
};

const isFiltersMatchingProductRelease = (
  searchFilters: Filters,
  defaultFilters: Filters
): boolean => {
  if (searchFilters.product?.length !== defaultFilters.product.length) {
    return false;
  }
  if (searchFilters.release?.length !== defaultFilters.release.length) {
    return false;
  }
  if (
    searchFilters.product?.some(
      (product) => !defaultFilters.product.includes(product)
    )
  ) {
    return false;
  }
  if (
    searchFilters.release?.some(
      (release) => !defaultFilters.release?.includes(release)
    )
  ) {
    return false;
  }
  if (
    searchFilters.platform?.some(
      (platform) => !defaultFilters.platform?.includes(platform)
    )
  ) {
    return false;
  }
  return true;
};

const isFiltersMatchingReleaseOnly = (
  searchFilters: Filters,
  defaultFilters: Filters
): boolean => {
  if (searchFilters.product && searchFilters.product.length !== 0) {
    return false;
  }
  if (searchFilters.release?.length !== defaultFilters.release?.length) {
    return false;
  }
  if (
    searchFilters.release?.some(
      (release) => !defaultFilters.release?.includes(release)
    )
  ) {
    return false;
  }
  if (
    searchFilters.platform?.some(
      (platform) => !defaultFilters.platform?.includes(platform)
    )
  ) {
    return false;
  }
  return true;
};

const isFiltersIncludeThisDoc = (searchFilters: Filters): boolean => {
  if (!searchFilters.doc_title) {
    return false;
  }
  return true;
};

const isFiltersEmpty = (searchFilters: Filters): boolean => {
  return (
    (!searchFilters.product || searchFilters.product.length === 0) &&
    (!searchFilters.release || searchFilters.release.length === 0) &&
    (!searchFilters.platform || searchFilters.platform.length === 0)
  );
};

type SearchHeaderMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  docTitle?: string;
};

export function SearchHeaderMenu({
  anchorEl,
  onClose,
  docTitle,
}: SearchHeaderMenuProps) {
  const { state, dispatch } = useSearchHeaderLayoutContext();
  return (
    <Menu
      anchorEl={anchorEl}
      id="search-dropdown-menu"
      MenuListProps={{
        'aria-labelledby': 'search-menu-button',
      }}
      open={state.isMenuExpanded}
      onClose={onClose}
      onClick={onClose}
      elevation={0}
      sx={{
        height: '60vh',
        marginBlockStart: '.5rem',
        '& .MuiMenu-paper': {
          border: 1,
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* TODO pass type and let SearchHeaderMenuItem handle its own props */}
      <MenuList
        sx={{
          width: state.isFiltersExpanded ? '455px' : '200px',
        }}
      >
        {state.defaultFilters.product && (
          <SearchHeaderMenuItem
            itemKey="product"
            tooltipTitle={`Search within products on this page: ${state.defaultFilters.product
              .toString()
              .replace(/,/g, ', ')}`}
            selected={isFiltersMatchingProductReleaseOnly(
              state.searchFilters,
              state.defaultFilters
            )}
            handleClick={() => {
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: state.defaultFilters,
              });
            }}
            itemLabel={`This product 
          (${state.defaultFilters.product.toString().replace(/,/g, ', ')})`}
          />
        )}
        <SearchHeaderMenuItem
          itemKey="release"
          tooltipTitle={`Search within all products in ${state.defaultFilters.release
            .toString()
            .replace(/,/g, ', ')}`}
          selected={isFiltersMatchingReleaseOnly(
            state.searchFilters,
            state.defaultFilters
          )}
          handleClick={() => {
            const { product, ...filtersWithoutProduct } = state.defaultFilters;
            dispatch({
              type: 'SET_SELECTED_FILTERS',
              payload: filtersWithoutProduct,
            });
          }}
          itemLabel={`This release
          (${state.defaultFilters.release.toString().replace(/,/g, ', ')})`}
        />
        {docTitle && (
          <SearchHeaderMenuItem
            itemKey="thisdoc"
            tooltipTitle="Search within this document"
            selected={isFiltersIncludeThisDoc(state.searchFilters)}
            handleClick={() => {
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: {
                  ...state.defaultFilters,
                  doc_title: [docTitle],
                },
              });
            }}
            itemLabel="This document"
          />
        )}
        <SearchHeaderMenuItem
          itemKey="entiresite"
          tooltipTitle="Search entire site without filters"
          selected={isFiltersEmpty(state.searchFilters)}
          handleClick={() => {
            const { product, release, ...filtersWithoutProductOrRelease } =
              state.defaultFilters;
            dispatch({
              type: 'SET_SELECTED_FILTERS',
              payload: filtersWithoutProductOrRelease,
            });
          }}
          itemLabel="Entire site"
        />
        <Divider />
        <SearchHeaderMenuItem
          itemKey="expand-filters"
          tooltipTitle={
            state.isFiltersExpanded
              ? 'Your filter selections will apply when you enter a search query'
              : 'Show selected filters and add or remove more filters'
          }
          selected={false}
          handleClick={(event: Event): void => {
            dispatch({
              type: 'SET_FILTERS_EXPANDED',
              payload: !state.isFiltersExpanded,
            });
            event.stopPropagation();
          }}
          itemLabel={state.isFiltersExpanded ? 'Hide filters' : 'Show filters'}
          menuItemSx={{ color: 'hsl(196, 100%, 31%)' }}
        />
        {state.isFiltersExpanded && <SearchHeaderMenuFilterGrid />}
      </MenuList>
    </Menu>
  );
}
