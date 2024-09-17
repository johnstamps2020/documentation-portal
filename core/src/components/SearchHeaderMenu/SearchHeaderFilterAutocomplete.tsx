import React from 'react';
import { translate } from '../../lib';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
  Filters,
  useSearchHeaderLayoutContext,
} from './SearchHeaderLayoutContext';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type SearchHeaderFilterAutocompleteProps = {
  filterType: Filters;
};
export function SearchHeaderFilterAutocomplete({
  filterType,
}: SearchHeaderFilterAutocompleteProps) {
  const { state, dispatch } = useSearchHeaderLayoutContext();
  const header = translate({
    id: `search.filter.menu.${Object.keys(filterType)[0]}`,
    message: Object.keys(filterType)[0].toUpperCase(),
  });

  function handleChange(event: React.SyntheticEvent, value: string[]) {
    let newSearchFilters = {
      ...state.searchFilters,
      [Object.keys(filterType)[0]]: value,
    };

    dispatch({ type: 'SET_SELECTED_FILTERS', payload: newSearchFilters });
  }

  return (
    <Grid
      item
      xs={12}
      md={12}
      id={`${filterType}-grid`}
      onClick={(e) => e.stopPropagation()}
    >
      <Tooltip
        key={`${filterType}-tooltip`}
        title={<Typography>{`Type or select ${filterType}`}</Typography>}
        placement="left"
        enterDelay={500}
        arrow
      >
        <Autocomplete
          id={`${filterType}-autocomplete`}
          //disablePortal
          multiple
          options={state.allFilters[Object.keys(filterType)[0]]}
          noOptionsText={`Type or select ${filterType}`}
          value={
            state.searchFilters[Object.keys(filterType)[0]]
              ? state.searchFilters[Object.keys(filterType)[0]]
              : undefined
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={header}
              placeholder={`Choose ${Object.keys(filterType)[0]}`}
            />
          )}
          sx={{ p: '2px 13px' }}
          onChange={(event, value) => {
            handleChange(event, value);
          }}
        />
      </Tooltip>
    </Grid>
  );
}
