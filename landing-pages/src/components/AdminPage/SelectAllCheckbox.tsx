import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAdminViewContext } from './AdminViewContext';

export default function SelectAllCheckbox() {
  const { selectedEntities, setSelectedEntities, filteredEntities } =
    useAdminViewContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedEntities(filteredEntities);
    } else {
      setSelectedEntities([]);
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={handleChange}
          value={selectedEntities.length === filteredEntities.length}
        />
      }
      label={`Select ${filteredEntities.length} items`}
    />
  );
}
