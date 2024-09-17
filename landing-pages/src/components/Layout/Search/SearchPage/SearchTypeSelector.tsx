import { navigateWithUpdatedParams } from '@doctools/core';
import { SearchType } from '@doctools/server';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { capitalizeFirstLetter } from 'helpers/landingPageHelpers';
import { searchTypeQueryParameterName } from 'vars';

const searchTypes: SearchType[] = ['keyword', 'semantic', 'hybrid'];

export default function SearchTypeSelector() {
  const query = new URLSearchParams(window.location.search);
  const selectedType =
    query.get(searchTypeQueryParameterName) || searchTypes[0];

  function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    query.set(searchTypeQueryParameterName, event.target.value);
    query.delete('page');
    navigateWithUpdatedParams(query);
  }

  return (
    <Stack sx={{ alignItems: 'center', gap: '16px' }}>
      <FormControl
        sx={{
          gap: '16px',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FormLabel id="search-type-selector">Select search type</FormLabel>
        <RadioGroup
          sx={{ flexDirection: 'row' }}
          value={selectedType}
          onChange={handleTypeChange}
        >
          {searchTypes.map((searchType) => (
            <FormControlLabel
              key={searchType}
              value={searchType}
              control={<Radio />}
              label={searchType}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {['semantic', 'hybrid'].includes(selectedType as SearchType) ? (
        <Alert severity="warning">
          <strong>Warning:</strong> {capitalizeFirstLetter(selectedType)} search
          is experimental. Search results are not necessarily accurate.
        </Alert>
      ) : (
        <Box sx={{ height: '48px' }} />
      )}
    </Stack>
  );
}
