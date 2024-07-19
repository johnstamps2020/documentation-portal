import InternalBadge from 'components/LandingPage/InternalBadge';
import LandingPageSelectorInContext from 'components/LandingPage/LandingPageSelectorInContext';
import { useUserInfo } from 'hooks/useApi';
import { useLayoutContext } from 'LayoutContext';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import TranslatedPages from './TranslatedPages';

export default function HeaderMenuItems() {
  const { userInfo } = useUserInfo();
  const { selector } = useLayoutContext();

  if (!userInfo) {
    return null;
  }

  return (
    <>
      {selector && <LandingPageSelectorInContext {...selector} />}
      <InternalBadge />
      <ExternalSites />
      <TranslatedPages />
      {userInfo.isLoggedIn && <Glossary />}
    </>
  );
}
