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
  const {
    isMenuExpanded,
    isFiltersExpanded,
    setIsFiltersExpanded,
    defaultFilters,
    setSearchFilters,
  } = useSearchHeaderLayoutContext();

  return (
    <Menu
      anchorEl={anchorEl}
      id="search-dropdown-menu"
      MenuListProps={{
        'aria-labelledby': 'search-menu-button',
      }}
      open={isMenuExpanded}
      onClose={onClose}
      onClick={onClose}
      elevation={0}
      sx={{
        maxWidth: isFiltersExpanded ? '515px' : '300px',
      }}
    >
      {/* TODO DRY using Object.keys map? */}
      <MenuList>
        <SearchHeaderMenuItem
          itemKey="release"
          tooltipTitle={defaultFilters.release.toString().replaceAll(',', ', ')}
          handleClick={() => {
            const { product, ...filtersWithoutProduct } = defaultFilters;
            setSearchFilters(filtersWithoutProduct);
          }}
          itemLabel={`This release
          (${defaultFilters.release.toString().replaceAll(',', ', ')})`}
        />
        {defaultFilters.product && (
          <SearchHeaderMenuItem
            itemKey="product"
            tooltipTitle={defaultFilters.product
              .toString()
              .replaceAll(',', ', ')}
            handleClick={() => {
              setSearchFilters(defaultFilters);
            }}
            itemLabel={`This product 
          (${defaultFilters.product.toString().replaceAll(',', ', ')})`}
          />
        )}
        <SearchHeaderMenuItem
          itemKey="entiresite"
          tooltipTitle="Search entire site without filters"
          handleClick={() => {
            const { product, release, ...filtersWithoutProductOrRelease } =
              defaultFilters;
            setSearchFilters(filtersWithoutProductOrRelease);
          }}
          itemLabel="Entire site"
        />
        <Divider />
        {/* TODO translate */}
        <SearchHeaderMenuItem
          itemKey="expand-filters"
          tooltipTitle={
            isFiltersExpanded
              ? 'Your filter selections will apply when you enter a search query'
              : 'Show selected filters and add or remove more filters'
          }
          handleClick={(event: Event): void => {
            setIsFiltersExpanded(!isFiltersExpanded);
            event.stopPropagation();
          }}
          itemLabel={isFiltersExpanded ? 'Hide filters' : 'Show filters'}
          menuItemSx={{ color: 'hsl(196, 100%, 31%)' }}
        />

        {isFiltersExpanded && <SearchHeaderMenuFilterGrid />}
      </MenuList>
    </Menu>
  );
}
