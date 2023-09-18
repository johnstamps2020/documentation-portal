import { externalSites } from '../ExternalSites';
import ItemListMobile from './ItemListMobile';

export default function ExternalSitesMobile() {
  return (
    <ItemListMobile
      items={externalSites.map((site) => ({
        ...site,
        target: '_blank',
        rel: 'noopener noreferrer',
      }))}
      title="Guidewire sites"
    />
  );
}
