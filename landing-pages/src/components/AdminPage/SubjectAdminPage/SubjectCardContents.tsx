import { Entity } from 'components/AdminPage/EntityListWithFilters';
import EntityDescription from '../EntityDescription';

export default function SubjectCardContents({ label }: Entity) {
  return <EntityDescription propList={[{ key: 'name', value: label }]} />;
}
