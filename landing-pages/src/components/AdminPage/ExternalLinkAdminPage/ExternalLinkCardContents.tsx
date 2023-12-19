import { Entity } from 'components/AdminPage/EntityListWithFilters';
import EntityLink from 'components/AdminPage/EntityLink';

export default function ExternalLinkCardContents({ url }: Entity) {
  return <EntityLink url={url!} label={url!} />;
}
