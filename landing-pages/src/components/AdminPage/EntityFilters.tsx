import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useAdminViewContext } from './AdminViewContext';

export default function EntityFilters(): JSX.Element {
  const { filters, setFilters, setPage, emptyFilters } = useAdminViewContext();

  function handleChange(field: string, value: string | boolean) {
    setFilters({
      ...filters,
      [field]: value,
    });
    setPage(1);
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        size="small"
        variant="text"
        onClick={() => setFilters(emptyFilters)}
      >
        Clear filters
      </Button>
      {Object.entries(filters)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return (
              <TextField
                key={key}
                label={key}
                value={filters.value}
                onChange={(event) => handleChange(key, event.target.value)}
              />
            );
          }
          return null;
        })
        .filter(Boolean)}
      <FormGroup>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            spacing: 2,
          }}
        >
          {Object.entries(filters)
            .map(([key, value]) => {
              if (typeof value === 'boolean') {
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        value={key}
                        checked={value}
                        onChange={(event) =>
                          handleChange(key, event.target.checked)
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label={key}
                  />
                );
              }
              return null;
            })
            .filter(Boolean)}
        </Box>
      </FormGroup>
    </Stack>
  );
}
