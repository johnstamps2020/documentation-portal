import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { useAdminViewContext } from './AdminViewContext';
import { Entity } from './EntityListWithFilters';

type EntityCheckboxProps = {
  entity: Entity;
};

export default function EntityCheckbox({ entity }: EntityCheckboxProps) {
  const { selectedEntities, setSelectedEntities } = useAdminViewContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (
      selectedEntities.find(
        (selectedEntity) =>
          selectedEntity.label === entity.label &&
          selectedEntity.url === entity.url
      )
    ) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [selectedEntities, entity]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const requestedValue = event.target.checked;
    setSelectedEntities((prevSelectedEntities: Entity[]) => {
      if (requestedValue) {
        return [...prevSelectedEntities, entity];
      } else {
        return prevSelectedEntities.filter((e) => e !== entity);
      }
    });
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      aria-label={`Select ${entity.label}`}
    />
  );
}
