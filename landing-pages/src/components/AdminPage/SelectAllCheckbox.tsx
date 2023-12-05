import Checkbox from '@mui/material/Checkbox';
import { useAdminViewContext } from './AdminViewContext';
import Tooltip from '@mui/material/Tooltip';

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
    <Tooltip title="Select all filtered items">
      <Checkbox
        onChange={handleChange}
        value={selectedEntities.length === filteredEntities.length}
      />
    </Tooltip>
  );
}
