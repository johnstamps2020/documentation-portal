import EntityCardValidationWarning from 'components/AdminPage/EntityCardValidationWarning';
import { Entity } from 'components/AdminPage/EntityListWithFilters';
import { routeTree } from './../../../routeTree.gen';

function findRouteByPath(
  tree: typeof routeTree.children,
  path: string
): boolean {
  if (!tree) return false;
  return Object.values(tree).some((route) => {
    const normalizedRoutePath = route.path.endsWith('/')
      ? route.path.slice(0, -1)
      : route.path;
    const normalizedEntityPath = path.endsWith('/') ? path.slice(0, -1) : path;
    if (normalizedRoutePath === normalizedEntityPath) return true;
    if (
      normalizedRoutePath.includes('/$version') &&
      normalizedRoutePath.replace('/$version', '') ===
        normalizedEntityPath.slice(0, normalizedRoutePath.lastIndexOf('/'))
    ) {
      return true;
    }
    return false;
  });
}

export function checkIfFileExists(entity: Entity) {
  return findRouteByPath(routeTree.children, entity.path);
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
