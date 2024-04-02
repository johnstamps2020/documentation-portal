import Grid from '@mui/material/Grid';
import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import SearchHeaderMenuFilterSubGrid from './SearchHeaderMenuFilterSubGrid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function SearchHeaderMenuFilterGrid() {
  const { state } = useSearchHeaderLayoutContext();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2} direction="row">
      {state.allFilters?.release && (
        <SearchHeaderMenuFilterSubGrid filterType="release" />
      )}
      {state.allFilters?.product && (
        <SearchHeaderMenuFilterSubGrid filterType="product" />
      )}
      {/* {smallScreen && (
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            onClick={() => {
              dispatch({ type: 'SET_MENU_EXPANDED', payload: false });
              dispatch({ type: 'SET_FILTERS_EXPANDED', payload: false });
            }}
          ></Button>
        </Grid>
      )} */}
    </Grid>
  );
}
