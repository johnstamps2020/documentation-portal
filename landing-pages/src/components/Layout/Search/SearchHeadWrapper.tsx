import { useRef, useState } from 'react';
import SearchBox from './SearchBox/SearchBox';
import SearchHeaderButton from './SearchDropdown/SearchHeaderButton';
import SearchHeaderMenu from './SearchDropdown/SearchHeaderMenu';
import { useSearchHeaderLayoutContext } from './SearchDropdown/SearchHeaderLayoutContext';

export default function SearchHeadWrapper() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state, dispatch } = useSearchHeaderLayoutContext();
  const searchBoxRef = useRef<HTMLInputElement | undefined>();

  const focusSearchBox = () => {
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch({ type: 'SET_MENU_EXPANDED', payload: !state.isMenuExpanded });
    focusSearchBox();
  };
  const handleClose = () => {
    setAnchorEl(null);
    dispatch({ type: 'SET_MENU_EXPANDED', payload: !state.isMenuExpanded });
    dispatch({ type: 'SET_FILTERS_EXPANDED', payload: false });
    focusSearchBox();
  };

  return (
    <>
      <SearchHeaderButton handleClick={handleClick}>
        <SearchHeaderMenu anchorEl={anchorEl} onClose={handleClose} />
      </SearchHeaderButton>
      <SearchBox
        ref={searchBoxRef}
        big={false}
        searchFilters={state.searchFilters}
      />
    </>
  );
}
