import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import { SearchHeaderMenuFilterSubGridItems } from './SearchHeaderMenuFilterSubGridItems';
import { translate } from '../../lib';

type SearchHeaderMenuFilterSubGridProps = {
  filterType: 'product' | 'release';
};

export function SearchHeaderMenuFilterSubGrid({
  filterType,
}: SearchHeaderMenuFilterSubGridProps) {
  const { state, dispatch } = useSearchHeaderLayoutContext();

  function handleSelfmanagedCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    event.stopPropagation();
    const { platform, ...filtersWithoutPlatform } = state.searchFilters;

    state.searchFilters['platform']
      ? dispatch({
          type: 'SET_SELECTED_FILTERS',
          payload: filtersWithoutPlatform,
        })
      : dispatch({
          type: 'SET_SELECTED_FILTERS',
          payload: {
            ...state.searchFilters,
            release: [],
            platform: ['Self-managed'],
          },
        });
  }

  const header = translate({
    id: `search.filter.menu.${filterType}`,
    message: filterType.toUpperCase(),
  });
  const filters = state.allFilters![filterType];
  const selectedDefaultFilters = filters?.filter((f) => {
    return state.defaultFilters[filterType]?.some((df) => df === f);
  });
  const unselectedFilters = filters?.filter((f) => {
    return !state.defaultFilters[filterType]?.includes(f);
  });

  return (
    <Grid
      item
      xs={12}
      md={filterType === 'release' ? 5 : 7}
      id={`${filterType}-grid`}
    >
      <Typography
        sx={{
          fontSize: '0.875rem',
          p: '2px 13px',
          fontWeight: '600',
        }}
      >
        {header}
      </Typography>
      <SearchHeaderMenuFilterSubGridItems
        filters={selectedDefaultFilters}
        filterType={filterType}
      />
      <SearchHeaderMenuFilterSubGridItems
        filters={unselectedFilters}
        filterType={filterType}
      />
      {filterType === 'release' && ( // separate component
        <>
          <Divider variant="middle" sx={{ marginBlock: '.5rem' }} />
          <FormControlLabel
            key="selfmanaged"
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
                  state.searchFilters['platform']?.includes('Self-managed')
                    ? true
                    : false
                }
                value="Self-managed"
                onChange={handleSelfmanagedCheckboxChange}
                sx={{
                  height: '14px',
                }}
              />
            }
            label={'Self-managed'}
          />
        </>
      )}
    </Grid>
  );
}
