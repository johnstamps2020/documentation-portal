import Grid from '@mui/material/Grid';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import SearchHeaderMenuFilterSubGrid from './SearchHeaderMenuFilterSubGrid';

export default function SearchHeaderMenuFilterGrid() {
  const { state } = useSearchHeaderLayoutContext();

  return (
    <Grid container spacing={2} direction="row">
      {state.allFilters?.release && (
        <SearchHeaderMenuFilterSubGrid filterType="release" />
      )}
      {state.allFilters?.product && (
        <SearchHeaderMenuFilterSubGrid filterType="product" />
      )}
    </Grid>
  );
}
