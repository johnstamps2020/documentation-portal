import React from 'react';
import Grid from '@mui/material/Grid';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import { SearchHeaderMenuFilterSubGrid } from './SearchHeaderMenuFilterSubGrid';
import { SearchHeaderFilterAutocomplete } from './SearchHeaderFilterAutocomplete';

export function SearchHeaderMenuFilterGrid() {
  const { state } = useSearchHeaderLayoutContext();
  const showAutocomplete = false;
  return (
    <Grid container spacing={2} direction="row" paddingBlockStart={1.5}>
      {state.allFilters?.product && showAutocomplete && (
        <SearchHeaderFilterAutocomplete filterType={{ product: [] }} />
      )}
      {state.allFilters?.release && showAutocomplete && (
        <SearchHeaderFilterAutocomplete filterType={{ release: [] }} />
      )}
      {state.allFilters?.product && !showAutocomplete && (
        <SearchHeaderMenuFilterSubGrid filterType="product" />
      )}
      {state.allFilters?.release && !showAutocomplete && (
        <SearchHeaderMenuFilterSubGrid filterType="release" />
      )}
    </Grid>
    // consider adding button for a) mobile and b) clarity
  );
}
