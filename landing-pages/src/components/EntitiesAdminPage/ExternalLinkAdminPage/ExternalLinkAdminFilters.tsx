import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export type ExternalLinkFilters = {
  url: string;
  label: string;
  internal: boolean;
  public: boolean;
  earlyAccess: boolean;
  isInProduction: boolean;
};

type ExternalLinkAdminFiltersProps = {
  filters: ExternalLinkFilters;
  setFilters: (filters: ExternalLinkFilters) => void;
  page: number;
  setPage: (page: number) => void;
  emptyFilters: ExternalLinkFilters;
};

export default function ExternalLinkAdminFilters({
  filters,
  setFilters,
  page,
  setPage,
  emptyFilters,
}: ExternalLinkAdminFiltersProps): JSX.Element {
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
      <TextField
        label="Url"
        value={filters.url}
        onChange={(event) => handleChange('url', event.target.value)}
      />
      <TextField
        label="Label"
        value={filters.label}
        onChange={(event) => handleChange('label', event.target.value)}
      />
      <FormGroup>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            spacing: 2,
          }}
        >
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
        </Box>
      </FormGroup>
    </Stack>
  );
}
