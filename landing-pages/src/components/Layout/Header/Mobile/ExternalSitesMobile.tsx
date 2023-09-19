import { externalSites } from '../ExternalSites';
import ItemListMobile from './ItemListMobile';

export default function ExternalSitesMobile() {
  return <ItemListMobile items={externalSites} title="Guidewire sites" />;
}
