import React from 'react';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import {
  Filters,
  useSearchHeaderLayoutContext,
} from './SearchHeaderLayoutContext';
import { SearchHeaderMenuItem } from './SearchHeaderMenuItem';
import { SearchHeaderMenuFilterGrid } from './SearchHeaderMenuFilterGrid';
import { translate } from '../../lib';

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

  const thisDocLabelText = `${translate({
    id: 'search.filter.menu.thisdoc.label',
    message: 'This document',
  })} (${docTitle})`;

  const thisDocTooltipText = `${translate({
    id: 'search.filter.menu.thisdoc.tooltip',
    message: 'Search within this document:',
  })} ${docTitle}`;

  const entireSiteLabelText = translate({
    id: 'search.filter.menu.entiresite.label',
    message: 'Entire site',
  });

  const entireSiteTooltipText = translate({
    id: 'search.filter.menu.entiresite.tooltip',
    message: 'Search entire site without filters',
  });

  const productLabelText = state.defaultFilters.product
    ? `${translate({
        id: 'search.filter.menu.product.label',
        message: 'This product',
      })} (${state.defaultFilters.product.toString().replace(/,/g, ', ')})`
    : '';

  const productTooltipText = state.defaultFilters.product
    ? `${translate({
        id: 'search.filter.menu.product.tooltip',
        message: 'Search within products on this page:',
      })} ${state.defaultFilters.product.toString().replace(/,/g, ', ')}`
    : '';

  const releaseLabelText = state.defaultFilters.release
    ? `${translate({
        id: 'search.filter.menu.release.label',
        message: 'This release',
      })} (${state.defaultFilters.release.toString().replace(/,/g, ', ')})`
    : '';

  const releaseTooltipText = state.defaultFilters.release
    ? `${translate({
        id: 'search.filter.menu.release.tooltip',
        message: 'Search within all products in this release:',
      })} ${state.defaultFilters.release.toString().replace(/,/g, ', ')}`
    : '';

  const showFiltersLabelClosedText = translate({
    id: 'search.filter.menu.showfilters.label.closed',
    message: 'Show filters',
  });

  const showFiltersLabelExpandedText = translate({
    id: 'search.filter.menu.showfilters.label.expanded',
    message: 'Hide filters',
  });

  const showFiltersTooltipClosedText = translate({
    id: 'search.filter.menu.showfilters.tooltip.closed',
    message: 'Show selected filters and add or remove more filters',
  });

  const showFiltersTooltipExpandedText = translate({
    id: 'search.filter.menu.showfilters.tooltip.expanded',
    message: 'Your filter selections will apply when you enter a search query',
  });

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
          width: state.isFiltersExpanded ? '455px' : '300px',
        }}
      >
        {state.defaultFilters.product && (
          <SearchHeaderMenuItem
            itemKey="product"
            tooltipTitle={productTooltipText}
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
            itemLabel={productLabelText}
          />
        )}
        <SearchHeaderMenuItem
          itemKey="release"
          tooltipTitle={releaseTooltipText}
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
          itemLabel={releaseLabelText}
        />
        {docTitle && (
          <SearchHeaderMenuItem
            itemKey="thisdoc"
            tooltipTitle={thisDocTooltipText}
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
            itemLabel={thisDocLabelText}
          />
        )}
        <SearchHeaderMenuItem
          itemKey="entiresite"
          tooltipTitle={entireSiteTooltipText}
          selected={isFiltersEmpty(state.searchFilters)}
          handleClick={() => {
            const { product, release, ...filtersWithoutProductOrRelease } =
              state.defaultFilters;
            dispatch({
              type: 'SET_SELECTED_FILTERS',
              payload: filtersWithoutProductOrRelease,
            });
          }}
          itemLabel={entireSiteLabelText}
        />
        <Divider />
        <SearchHeaderMenuItem
          itemKey="expand-filters"
          tooltipTitle={
            state.isFiltersExpanded
              ? showFiltersTooltipExpandedText
              : showFiltersTooltipClosedText
          }
          selected={false}
          handleClick={(event: Event): void => {
            dispatch({
              type: 'SET_FILTERS_EXPANDED',
              payload: !state.isFiltersExpanded,
            });
            event.stopPropagation();
          }}
          itemLabel={
            state.isFiltersExpanded
              ? showFiltersLabelExpandedText
              : showFiltersLabelClosedText
          }
          menuItemSx={{ color: 'hsl(196, 100%, 31%)' }}
        />
        {state.isFiltersExpanded && <SearchHeaderMenuFilterGrid />}
      </MenuList>
    </Menu>
  );
}
