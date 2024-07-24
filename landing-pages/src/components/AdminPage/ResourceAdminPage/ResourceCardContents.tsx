import EntityDescription from 'components/AdminPage/EntityDescription';
import { Entity } from 'components/AdminPage/EntityListWithFilters';

export default function ResourceCardContents({
  sourceFolder,
  targetFolder,
  source,
}: Entity) {
  return (
    <EntityDescription
      propList={[
        { key: 'sourceFolder', value: sourceFolder },
        { key: 'targetFolder', value: targetFolder },
        { key: 'source', value: source ? source.name : 'no source added' },
      ]}
    />
  );
}
