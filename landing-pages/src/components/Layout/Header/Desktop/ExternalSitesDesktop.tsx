import iconExternalSites from 'images/icon-externalSites.svg';
import { externalSites } from '../ExternalSites';
import HeaderMenuDesktop from './HeaderMenuDesktop';

export default function ExternalSitesDesktop() {
  return (
    <HeaderMenuDesktop
      id="external-sites"
      iconSrc={iconExternalSites}
      title="Guidewire sites"
      items={externalSites.map((site) => ({
        ...site,
        target: '_blank',
        rel: 'noopener noreferrer',
      }))}
    />
  );
}
