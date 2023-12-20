import EntityDescription from 'components/AdminPage/EntityDescription';
import { Entity } from 'components/AdminPage/EntityListWithFilters';

export default function ResourceCardContents({
  label,
  id,
  sourceFolder,
  targetFolder,
  source,
}: Entity) {
  return (
    <EntityDescription
      propList={[
        { key: 'id', value: label },
        { key: 'sourceFolder', value: sourceFolder },
        { key: 'targetFolder', value: targetFolder },
        { key: 'source', value: source ? source.name : 'no source added' },
      ]}
    />
  );
}
