import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { useSearchData } from '../../hooks/useApi';

export default function PaginationSelector() {
  const { searchData } = useSearchData();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pagination = parseInt(query.get('pagination') || '10');

  function handleChange(event: SelectChangeEvent) {
    query.set('pagination', event.target.value);
    query.delete('page');
    navigate({
      pathname: location.pathname,
      search: `?${query.toString()}`,
    });
  }

  if (!searchData) {
    return null;
  }
  return (
    <Box sx={{ minWidth: '80px', width: '80px' }}>
      <FormControl size="small" fullWidth>
        <InputLabel>View items</InputLabel>
        <Select
          labelId="pagination-selector-label"
          id="pagination-selector"
          label="View items"
          value={pagination.toString()}
          onChange={handleChange}
          renderValue={value => {
            return value;
          }}
        >
          {['10', '25', '50', '100'].map(numberOfResults => (
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
