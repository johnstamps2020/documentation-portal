import { translate } from '@doctools/components';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
//import { useSearchHeaderLayoutContext } from './SearchHeaderLayoutContext';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ServerSearchFilter } from '@doctools/components';
import { useQueryParameters } from 'hooks/useQueryParameters';
import { useSearchData } from 'hooks/useApi';

type SearchHeaderFilterAutocompleteProps = {
  //allFilters: { key: string; values: string[] };
  allFilters: ServerSearchFilter;
};

export default function AppliedFilterAutocomplete({
  allFilters,
}: SearchHeaderFilterAutocompleteProps) {
  //  const { state, dispatch } = useSearchHeaderLayoutContext();
  const header = translate({
    id: `search.filter.menu.${allFilters.name}`,
    message: allFilters.name.toUpperCase(),
  });

  const { modifyFilterValue } = useQueryParameters();

  const { searchData, isError, isLoading } = useSearchData();

  if (!searchData || isLoading || isError) {
    return null;
  }

  const checkedSearchFilterValues = allFilters.values.filter(
    (value) => value.checked
  );

  // let values: string[] = [];

  // if (checkedSearchFilterValues.length > 0) {
  //   values = checkedSearchFilterValues.map((v) => v.label);
  // }

  const checkedValues = checkedSearchFilterValues.map((v) => v.label);

  const allValues = allFilters.values.map((v) => v.label);

  // if (!values) {
  //   return null;
  // }

  // function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   modifyFilterValue(name, event.target.value, event.target.checked);
  // }

  // function handleChange(event: React.SyntheticEvent, value: string[]) {
  //   modifyFilterValue(name, value, event.target.checked);

  // let newSearchFilters = {
  //   ...state.searchFilters,
  //   [filterType.name]: value,
  // };

  // dispatch({ type: 'SET_SELECTED_FILTERS', payload: newSearchFilters });
  //}

  return (
    <Grid
      item
      xs={3}
      md={3}
      id={`${allFilters.name}-grid`}
      onClick={(e) => e.stopPropagation()}
    >
      <Tooltip
        key={`${allFilters.name}-tooltip`}
        title={<Typography>{`Type or select ${allFilters.name}`}</Typography>}
        placement="left"
        enterDelay={500}
        arrow
      >
        <Autocomplete
          id={`${allFilters.name}-autocomplete`}
          //disablePortal
          multiple
          limitTags={1}
          options={allValues}
          size="small"
          noOptionsText={`Type or select ${allFilters.name}`}
          defaultValue={checkedValues}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={header}
              //placeholder={`Choose ${allFilters.name}`}
            />
          )}
          sx={{ p: '2px 13px' }}
          //onChange={(event, value) => {
          //  handleChange(event, value);
          //}}
          onChange={(event, value) => null}
        />
      </Tooltip>
    </Grid>
  );
}
