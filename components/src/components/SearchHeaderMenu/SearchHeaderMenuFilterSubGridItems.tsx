import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  useSearchHeaderLayoutContext,
  Filters,
} from './SearchHeaderLayoutContext';

type SearchHeaderMenuFilterSubGridItemsProps = {
  filters: string[];
  filterType: string;
};

export function SearchHeaderMenuFilterSubGridItems({
  filters,
  filterType,
}: SearchHeaderMenuFilterSubGridItemsProps) {
  const { state, dispatch } = useSearchHeaderLayoutContext();

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    let newSearchFilterItems: string[] = state.searchFilters[filterType]
      ? [...state.searchFilters[filterType]]
      : [];

    let newSearchFilters = {};
    if (state.searchFilters[filterType]?.includes(event.target.value)) {
      newSearchFilterItems = state.searchFilters[filterType].filter((name) => {
        return name !== event.target.value;
      });
      newSearchFilters = {
        ...state.searchFilters,
        [filterType]: newSearchFilterItems,
      };
    } else {
      newSearchFilterItems.push(event.target.value);
      if (
        filterType === 'release' &&
        state.searchFilters.platform?.includes('Self-managed')
      ) {
        const { platform, ...filtersWithoutPlatform } = state.searchFilters;
        newSearchFilters = {
          ...filtersWithoutPlatform,
          [filterType]: newSearchFilterItems,
        };
      } else {
        newSearchFilters = {
          ...state.searchFilters,
          [filterType]: newSearchFilterItems,
        };
      }
    }

    dispatch({ type: 'SET_SELECTED_FILTERS', payload: newSearchFilters });
  }

  return (
    <>
      {filters!.map((f) => (
        <FormControlLabel
          key={f}
          disableTypography={true}
          onClick={(event) => event?.stopPropagation()}
          sx={{
            marginRight: '8px',
            fontSize: '0.85rem',
            p: '2px 13px',
            width: '100%',
          }}
          control={
            <Checkbox
              checked={
                state.searchFilters[filterType]?.includes(f) ? true : false
              }
              value={f}
              onChange={handleCheckboxChange}
              sx={{
                height: '14px',
              }}
            />
          }
          label={f}
        />
      ))}
    </>
  );
}
