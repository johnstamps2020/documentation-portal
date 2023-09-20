import InternalBadge from 'components/LandingPage/InternalBadge';
import ExternalSites from './ExternalSites';
import Glossary from './Glossary';
import TranslatedPages from './TranslatedPages';
import { useUserInfo } from 'hooks/useApi';

export default function HeaderMenuItems() {
  const { userInfo, isError, isLoading } = useUserInfo();

  if (isError || isLoading || !userInfo) {
    return null;
  }

  return (
    <>
      <InternalBadge />
      <ExternalSites />
      {userInfo.isLoggedIn && (
        <>
          <Glossary />
          <TranslatedPages />
        </>
      )}
    </>
  );
}
