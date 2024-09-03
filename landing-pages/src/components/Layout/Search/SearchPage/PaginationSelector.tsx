import { navigateWithUpdatedParams } from '@doctools/components';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import { useSearchData } from 'hooks/useApi';

export default function PaginationSelector() {
  const { searchData, isLoading, isError } = useSearchData();
  const query = new URLSearchParams(window.location.search);
  const pagination = parseInt(query.get('pagination') || '10');

  function handleChange(event: SelectChangeEvent) {
    query.set('pagination', event.target.value);
    query.delete('page');
    navigateWithUpdatedParams(query);
  }

  if (isError || searchData?.totalNumOfResults === 0) {
    return null;
  }

  if (isLoading || !searchData) {
    return (
      <Skeleton variant="rectangular" sx={{ width: '80px', height: '40px' }} />
    );
  }
  return (
    <Box sx={{ minWidth: '80px' }}>
      <FormControl size="small" fullWidth>
        <InputLabel>View items</InputLabel>
        <Select
          labelId="pagination-selector-label"
          id="pagination-selector"
          label="View items"
          value={pagination.toString()}
          onChange={handleChange}
          renderValue={(value) => {
            return value;
          }}
        >
          {['10', '25', '50', '100'].map((numberOfResults) => (
            <MenuItem
              disabled={numberOfResults === pagination.toString()}
              value={numberOfResults}
              key={numberOfResults}
            >
              {numberOfResults}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
