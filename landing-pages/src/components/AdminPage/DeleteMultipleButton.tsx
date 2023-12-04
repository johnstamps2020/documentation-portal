import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useAdminViewContext } from './AdminViewContext';

export default function DeleteMultipleButton() {
  const { selectedEntities } = useAdminViewContext();

  if (selectedEntities.length === 0) {
    return null;
  }

  return (
    <Button color="error" variant="contained" startIcon={<DeleteIcon />}>
      Delete {selectedEntities.length} item{selectedEntities.length > 1 && 's'}
    </Button>
  );
}
