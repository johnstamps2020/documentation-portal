import EntityCardValidationWarning from 'components/AdminPage/EntityCardValidationWarning';
import { Entity } from 'components/AdminPage/EntityListWithFilters';

export function checkIfFileExists(entity: Entity) {
  try {
    require(`../../../pages/${entity.path}.tsx`);
    return true;
  } catch (err) {
    return false;
  }
}

export default function PageValidationWarning(entity: Entity) {
  try {
    const fileExists = checkIfFileExists(entity);
    if (!fileExists) {
      return (
        <EntityCardValidationWarning>
          React component for this page path doesn't exist in landing pages.
        </EntityCardValidationWarning>
      );
    }
    return <></>;
  } catch (err) {
    console.log(err);
    return <></>;
  }
}
