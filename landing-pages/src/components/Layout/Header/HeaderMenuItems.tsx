import InternalBadge from 'components/LandingPage/InternalBadge';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import TranslatedPages from './TranslatedPages';
import { useUserInfo } from 'hooks/useApi';
import LandingPageSelector from 'components/LandingPage/LandingPageSelector';
import { useLayoutContext } from 'LayoutContext';

export default function HeaderMenuItems() {
  const { userInfo, isError, isLoading } = useUserInfo();
  const { selector } = useLayoutContext();

  if (isError || isLoading || !userInfo) {
    return null;
  }

  return (
    <>
      {selector && <LandingPageSelector {...selector} />}
      <InternalBadge />
      <ExternalSites />
      <TranslatedPages />
      {userInfo.isLoggedIn && <Glossary />}
    </>
  );
}
