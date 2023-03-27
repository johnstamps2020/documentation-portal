import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { emptyPage } from 'components/LandingPage/PagePropsController';
import { Page } from 'server/dist/model/entity/Page';

type Filters = Page;

const emptyFilters = emptyPage;

export default function Filters() {
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
    </Stack>
  );
}
