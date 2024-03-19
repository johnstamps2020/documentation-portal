import { translate } from '@doctools/components';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';

type SearchHeaderMenuFilterSubGridProps = {
  filterType: 'product' | 'release';
};

export default function SearchHeaderMenuFilterSubGrid({
  filterType,
}: SearchHeaderMenuFilterSubGridProps) {
  const { searchFilters, setSearchFilters, allFilters } =
    useSearchHeaderLayoutContext();

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    let newSearchFilterItems: string[] = searchFilters[filterType]
      ? [...searchFilters[filterType]]
      : [];
    if (searchFilters[filterType]?.includes(event.target.value)) {
      newSearchFilterItems = searchFilters[filterType].filter((name) => {
        return name !== event.target.value;
      });
    } else {
      newSearchFilterItems.push(event.target.value);
    }
    const newSearchFilters = {
      ...searchFilters,
      [filterType]: newSearchFilterItems,
    };

    setSearchFilters(newSearchFilters);
  }

  const header = translate({
    id: `search.filter.menu.${filterType}`,
    message: filterType.toUpperCase(),
  });
  const filters = allFilters![filterType];

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
      {filters &&
        filters.map((f) => (
          <FormControlLabel
            key={f.name}
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
                  searchFilters[filterType]?.includes(f.name) ? true : false
                }
                value={f.name}
                onChange={handleCheckboxChange}
                sx={{
                  height: '14px',
                }}
              />
            }
            label={f.name}
          />
        ))}
    </Grid>
  );
}
