import EntityCardValidationWarning from 'components/AdminPage/EntityCardValidationWarning';
import { Entity } from 'components/AdminPage/EntityListWithFilters';
import { routeTree } from './../../../routeTree.gen';

function extractPaths(tree: typeof routeTree.children): string[] {
  if (!tree) return [];
  const paths: string[] = [];

  Object.values(tree).forEach((route) => {
    paths.push(route.path);
  });
  return paths;
}

export function checkIfFileExists(entity: Entity) {
  const paths = extractPaths(routeTree.children);
  return paths.some((path) => {
    if (path === entity.path) return true;
    else if (path.endsWith('/') && path.slice(0, -1) === entity.path)
      return true;
    else if (
      path.includes('/$version') &&
      path.replace('/$version', '') ===
        entity.path.slice(0, path.lastIndexOf('/'))
    ) {
      return true;
    } else return false;
  });
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
