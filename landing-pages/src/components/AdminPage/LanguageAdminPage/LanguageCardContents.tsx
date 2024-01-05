import { Entity } from 'components/AdminPage/EntityListWithFilters';
import EntityDescription from '../EntityDescription';

export default function LanguageCardContents({ code }: Entity) {
  return <EntityDescription propList={[{ key: 'code', value: code! }]} />;
}
