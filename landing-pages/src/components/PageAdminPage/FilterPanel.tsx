import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import PageList from './PageList';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const emptyFilters = {
  path: '',
  title: '',
  component: '',
  searchFilters: {},
  internal: true,
  public: false,
  earlyAccess: true,
  isInProduction: false,
};

export default function FilterPanel() {
  const [filters, setFilters] = useState(emptyFilters);

  function handleChange(field: string, value: string | boolean) {
    setFilters({
      ...filters,
      [field]: value,
    });
  }

  return (
    <Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          label="Path"
          value={filters.path}
          onChange={(event) => handleChange('path', event.target.value)}
        />
        <TextField
          label="Title"
          value={filters.title}
          onChange={(event) => handleChange('title', event.target.value)}
        />
        <TextField
          label="Component"
          value={filters.component}
          onChange={(event) => handleChange('component', event.target.value)}
        />
        <FormGroup row>
          {['internal', 'public', 'earlyAccess', 'isInProduction'].map(
            (key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    value={key}
                    checked={filters[key as keyof typeof filters] as boolean}
                    onChange={(event) =>
                      handleChange(key, event.target.checked)
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={key}
              />
            )
          )}
        </FormGroup>
      </Stack>
      <PageList filters={filters} />
    </Stack>
  );
}
