import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAdminViewContext } from './AdminViewContext';

const ranges = [12, 24, 48, 96];
const label = 'per page';

export default function ResultsPerPageSelect() {
  const { resultsPerPage, setResultsPerPage, filteredEntities } =
    useAdminViewContext();

  const handleChange = (event: SelectChangeEvent) => {
    setResultsPerPage(parseInt(event.target.value));
  };

  return (
    <FormControl sx={{ width: '100px' }}>
      <InputLabel id="items-per-page-label">{label}</InputLabel>
      <Select
        labelId="items-per-page-label"
        id="items-per-page"
        value={resultsPerPage.toString()}
        label={label}
        onChange={handleChange}
      >
        {ranges.map((range) => (
          <MenuItem value={range} key={range}>
            {range}
          </MenuItem>
        ))}
        <MenuItem value={filteredEntities.length}>
          All {filteredEntities.length}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
