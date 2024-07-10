import React from 'react';
import { useRef, useState } from 'react';
import { SearchBox } from '../SearchBox';
import { SearchHeaderButton } from './SearchHeaderButton';
import { SearchHeaderMenu } from './SearchHeaderMenu';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';

type SearchHeadWrapperProps = {
  placeholder: string;
  isMobile: boolean;
  searchTypeQueryParameterName: string;
  docTitle?: string;
};
export function SearchHeadWrapper({
  placeholder,
  isMobile,
  searchTypeQueryParameterName,
  docTitle,
}: SearchHeadWrapperProps) {
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
      {!isMobile && (
        <SearchHeaderButton handleClick={handleClick}>
          <SearchHeaderMenu
            anchorEl={anchorEl}
            onClose={handleClose}
            docTitle={docTitle}
          />
        </SearchHeaderButton>
      )}
      <SearchBox
        ref={searchBoxRef}
        big={false}
        searchFilters={state.searchFilters}
        placeholder={placeholder}
        isMobile={isMobile}
        searchTypeQueryParameterName={searchTypeQueryParameterName}
      />
    </>
  );
}
