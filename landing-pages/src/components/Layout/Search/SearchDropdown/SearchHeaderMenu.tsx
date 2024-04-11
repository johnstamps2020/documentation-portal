// TODO translate strings
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import {
  Filters,
  useSearchHeaderLayoutContext,
} from './SearchHeaderLayoutContext';
import SearchHeaderMenuItem from './SearchHeaderMenuItem';
import SearchHeaderMenuFilterGrid from './SearchHeaderMenuFilterGrid';

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
  if (searchFilters.platform) {
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
  if (searchFilters.platform) {
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
};

export default function SearchHeaderMenu({
  anchorEl,
  onClose,
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
      sx={{ height: '60vh', marginBlockStart: '.5rem' }}
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
              .replaceAll(',', ', ')}`}
            selected={isFiltersMatchingProductRelease(
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
          (${state.defaultFilters.product.toString().replaceAll(',', ', ')})`}
          />
        )}
        <SearchHeaderMenuItem
          itemKey="release"
          tooltipTitle={`Search within all products in ${state.defaultFilters.release
            .toString()
            .replaceAll(',', ', ')}`}
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
          (${state.defaultFilters.release.toString().replaceAll(',', ', ')})`}
        />
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
