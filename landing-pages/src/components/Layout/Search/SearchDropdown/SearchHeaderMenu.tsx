// TODO translate strings
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import SearchHeaderMenuItem from './SearchHeaderMenuItem';
import SearchHeaderMenuFilterGrid from './SearchHeaderMenuFilterGrid';

type SearchHeaderMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export default function SearchHeaderMenu({
  anchorEl,
  onClose,
}: SearchHeaderMenuProps) {
  const { state, dispatch } = useSearchHeaderLayoutContext();

  const isFiltersMatchingProductRelease = (): boolean => {
    return (
      state.searchFilters.product?.length ===
        state.defaultFilters.product.length &&
      !state.searchFilters.product?.some(
        (product) => !state.defaultFilters.product.includes(product)
      ) &&
      state.searchFilters.release.length ===
        state.defaultFilters.release.length &&
      !state.searchFilters.release?.some(
        (release) => !state.defaultFilters.release?.includes(release)
      ) &&
      !state.searchFilters.platform
    );
  };
  const isFiltersMatchingReleaseOnly = (): boolean => {
    return (
      (!state.searchFilters.product ||
        state.searchFilters.product.length === 0) &&
      state.searchFilters.release?.length ===
        state.defaultFilters.release?.length &&
      !state.searchFilters.release?.some(
        (release) => !state.defaultFilters.release?.includes(release)
      ) &&
      !state.searchFilters.platform
    );
  };
  const isFiltersEmpty = (): boolean => {
    return (
      (!state.searchFilters.product ||
        state.searchFilters.product.length === 0) &&
      (!state.searchFilters.release ||
        state.searchFilters.release.length === 0) &&
      (!state.searchFilters.platform ||
        state.searchFilters.platform.length === 0)
    );
  };

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
      {/* TODO pass type and let SearchHeaderMenuItem handle its own props
          TODO clean up selected logic
      */}
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
            selected={isFiltersMatchingProductRelease()}
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
          selected={isFiltersMatchingReleaseOnly()}
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
          selected={isFiltersEmpty()}
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
