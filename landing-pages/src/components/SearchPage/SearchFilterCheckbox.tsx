import Stack from '@mui/material/Stack';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import { ServerSearchFilterValue } from 'server/dist/types/serverSearch';
import { useQueryParameters } from 'hooks/useQueryParameters';

type SearchFilterCheckboxProps = {
  name: string;
  value: ServerSearchFilterValue;
};

export default function SearchFilterCheckbox({
  name,
  value,
}: SearchFilterCheckboxProps) {
  const { modifyFilterValue } = useQueryParameters();

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    modifyFilterValue(name, event.target.value, event.target.checked);
  }

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      {(value.doc_count > 0 || value.checked) && (
        <FormControlLabel
          disableTypography={true}
          sx={{
            marginRight: '8px',
            fontSize: '0.85rem',
          }}
          control={
            <Checkbox
              checked={value.checked}
              value={value.label}
              onChange={handleCheckboxChange}
              sx={{
                height: '14px',
              }}
            />
          }
          label={value.label}
        />
      )}
      <Chip
        label={value.doc_count}
        size="small"
        variant="outlined"
        sx={{ border: 0 }}
      />
    </Stack>
  );
}