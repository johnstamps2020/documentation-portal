import Checkbox from '@mui/material/Checkbox';
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
    <Checkbox
      onChange={handleChange}
      value={selectedEntities.length === filteredEntities.length}
    />
  );
}
