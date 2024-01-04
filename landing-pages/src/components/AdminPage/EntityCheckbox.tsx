import Checkbox from '@mui/material/Checkbox';
import { useAdminViewContext } from './AdminViewContext';
import { Entity } from './EntityListWithFilters';

type EntityCheckboxProps = {
  entity: Entity;
};

function getMatchingEntity(
  entity: Entity,
  selectedEntities: Entity[]
): Entity | undefined {
  return selectedEntities.find(
    (selectedEntity) =>
      selectedEntity.label === entity.label &&
      ((selectedEntity.url && selectedEntity.url === entity.url) ||
        (selectedEntity.path && selectedEntity.path === entity.path) ||
        (selectedEntity.id && selectedEntity.id === entity.id) ||
        (selectedEntity.name && selectedEntity.name === entity.name))
  );
}

function isSelected(entity: Entity, selectedEntities: Entity[]): boolean {
  return getMatchingEntity(entity, selectedEntities) !== undefined;
}

export default function EntityCheckbox({ entity }: EntityCheckboxProps) {
  const { selectedEntities, setSelectedEntities } = useAdminViewContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const requestedValue = event.target.checked;
    setSelectedEntities((prevSelectedEntities: Entity[]) => {
      if (requestedValue) {
        return [...prevSelectedEntities, entity];
      } else {
        return prevSelectedEntities.filter(
          (e) => getMatchingEntity(e, [entity]) === undefined
        );
      }
    });
  };

  return (
    <Checkbox
      checked={isSelected(entity, selectedEntities)}
      onChange={handleChange}
      aria-label={`Select ${entity.label}`}
    />
  );
}
