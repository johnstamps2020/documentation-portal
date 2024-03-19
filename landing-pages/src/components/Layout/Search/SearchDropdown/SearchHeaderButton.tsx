import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchHeaderMenu from './SearchHeaderMenu';
import { useState } from 'react';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import { translate } from '@doctools/components';

export default function SearchHeaderButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state, dispatch } = useSearchHeaderLayoutContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch({ type: 'SET_MENU_EXPANDED', payload: !state.isMenuExpanded });
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch({ type: 'SET_MENU_EXPANDED', payload: !state.isMenuExpanded });
    dispatch({ type: 'SET_FILTERS_EXPANDED', payload: false });
  };

  let numFilters =
    (state.searchFilters.release?.length
      ? state.searchFilters.release.length
      : 0) +
    (state.searchFilters.product?.length
      ? state.searchFilters.product.length
      : 0);

  const buttonText = translate({
    id: 'search.filter.menu.button',
    message: 'Filter',
  });

  if (!state.defaultFilters.release) {
    return null;
  }

  return (
    <Button
      id="search-menu-button"
      onClick={handleClick}
      aria-controls={state.isMenuExpanded ? 'search-dropdown-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={state.isMenuExpanded ? 'true' : undefined}
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
