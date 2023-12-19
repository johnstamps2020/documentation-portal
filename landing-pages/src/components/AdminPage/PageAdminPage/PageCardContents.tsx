import { Entity } from 'components/AdminPage/EntityListWithFilters';
import EntityLinkWithSlash from 'components/AdminPage/EntityLinkWithSlash';

export default function PageCardContents({ path }: Entity) {
  return <EntityLinkWithSlash url={path} label={path} />;
}
