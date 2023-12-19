import EntityDescription from 'components/AdminPage/EntityDescription';
import { Entity } from 'components/AdminPage/EntityListWithFilters';

export default function SourceCardContents({ id, gitUrl, gitBranch }: Entity) {
  return (
    <EntityDescription
      propList={[
        { key: 'id', value: id },
        { key: 'gitUrl', value: gitUrl },
        { key: 'gitBranch', value: gitBranch },
      ]}
    />
  );
}
