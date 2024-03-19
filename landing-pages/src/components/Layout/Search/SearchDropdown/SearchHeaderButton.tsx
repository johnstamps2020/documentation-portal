import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchHeaderMenu from './SearchHeaderMenu';
import { useState } from 'react';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import { translate } from '@doctools/components';

export default function SearchHeaderButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    isMenuExpanded,
    setIsMenuExpanded,
    setIsFiltersExpanded,
    searchFilters,
    defaultFilters,
  } = useSearchHeaderLayoutContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuExpanded(!isMenuExpanded);
    setIsFiltersExpanded(false);
  };

  let numFilters =
    (searchFilters.release?.length ? searchFilters.release.length : 0) +
    (searchFilters.product?.length ? searchFilters.product.length : 0);

  const buttonText = translate({
    id: 'search.filter.menu.button',
    message: 'Filter',
  });

  if (!defaultFilters.release) {
    return null;
  }

  return (
    <Button
      id="search-menu-button"
      onClick={handleClick}
      aria-controls={isMenuExpanded ? 'search-dropdown-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={isMenuExpanded ? 'true' : undefined}
      variant="contained"
      disableElevation
      endIcon={<KeyboardArrowDownIcon />}
      sx={{
        bgcolor: 'white',
        fontSize: '0.875rem',
        p: '2px 13px',
        color: 'hsl(196, 100%, 31%)',
        marginRight: '1rem',
      }}
    >
      {buttonText} ({numFilters})
      <SearchHeaderMenu anchorEl={anchorEl} onClose={handleClose} />
    </Button>
  );
}
