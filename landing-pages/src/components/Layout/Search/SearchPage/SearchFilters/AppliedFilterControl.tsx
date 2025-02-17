import Chip from '@mui/material/Chip';
import { useQueryParameters } from 'hooks/useQueryParameters';
import { getCheckboxLabel } from './SearchFilterCheckbox';

type AppliedFilterControlProps = {
  name: string;
  value: string;
};

export default function AppliedFilterControl({
  name,
  value,
}: AppliedFilterControlProps) {
  const { modifyFilterValue } = useQueryParameters();

  function handleDelete() {
    modifyFilterValue(name, value, false);
  }

  return (
    <Chip
      label={getCheckboxLabel(value)}
      onDelete={handleDelete}
      color="primary"
      sx={{ borderRadius: 1 }}
    />
  );
}
