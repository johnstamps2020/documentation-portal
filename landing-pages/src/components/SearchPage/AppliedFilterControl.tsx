import Chip from '@mui/material/Chip';
import { useQueryParameters } from 'hooks/useQueryParameters';

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
      size="small"
      label={value}
      onDelete={handleDelete}
      color="primary"
      sx={{ borderRadius: 1 }}
    />
  );
}
