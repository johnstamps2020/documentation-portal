import { translate } from '@doctools/components';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import SearchHeaderMenuFilterSubGridItems from './SearchHeaderMenuFilterSubGridItems';

type SearchHeaderMenuFilterSubGridProps = {
  filterType: 'product' | 'release';
};

export default function SearchHeaderMenuFilterSubGrid({
  filterType,
}: SearchHeaderMenuFilterSubGridProps) {
  const { state } = useSearchHeaderLayoutContext();

  const header = translate({
    id: `search.filter.menu.${filterType}`,
    message: filterType.toUpperCase(),
  });
  const filters = state.allFilters![filterType];
  const selectedDefaultFilters = filters?.filter((f) => {
    return (
      state.defaultFilters[filterType]?.some((df) => df === f.name) &&
      state.searchFilters[filterType]
    );
  });
  const unselectedFilters = filters?.filter((f) => {
    return !state.defaultFilters[filterType]?.includes(f.name);
  });

  return (
    <Grid item xs={12} md={6} id="releases-grid">
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
    </Grid>
  );
}
