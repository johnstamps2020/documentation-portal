import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { capitalizeFirstLetter } from 'helpers/landingPageHelpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchType } from '@doctools/components';
import { searchTypeQueryParameterName } from 'vars';

const searchTypes: SearchType[] = ['keyword', 'semantic', 'hybrid'];

export default function SearchTypeSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedType =
    query.get(searchTypeQueryParameterName) || searchTypes[0];

  function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    query.set(searchTypeQueryParameterName, event.target.value);
    query.delete('page');
    navigate({
      pathname: location.pathname,
      search: `?${query.toString()}`,
    });
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
      {(selectedType as SearchType) !== 'keyword' ? (
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
