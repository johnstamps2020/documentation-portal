import Grid from '@mui/material/Grid';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import SearchHeaderMenuFilterSubGrid from './SearchHeaderMenuFilterSubGrid';

export default function SearchHeaderMenuFilterGrid() {
  const { allFilters } = useSearchHeaderLayoutContext();

  return (
    <Grid container spacing={2} direction="row">
      {allFilters?.release && (
        <SearchHeaderMenuFilterSubGrid filterType="release" />
      )}
      {allFilters?.product && (
        <SearchHeaderMenuFilterSubGrid filterType="product" />
      )}
    </Grid>
  );
}
