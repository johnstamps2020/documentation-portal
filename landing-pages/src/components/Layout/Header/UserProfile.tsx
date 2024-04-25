import { Avatar } from '@doctools/components';
import { useUserLinks } from 'hooks/useUserLinks';
import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { Link as RouterLink } from 'react-router-dom';

export default function UserProfile() {
  const { userInfo, isError, isLoading } = useUserInfo();
  const {
    envInfo,
    isLoading: isEnvInfoLoading,
    isError: isEnvInfoError,
  } = useEnvInfo();
  const { userLinks } = useUserLinks();

  if (isEnvInfoLoading || isEnvInfoError) {
    return null;
  }

  if (
    isError ||
    isLoading ||
    !userInfo ||
    window.location.pathname.startsWith('/gw-login')
  ) {
    return null;
  }

  return (
    <Avatar
      initialValue={{
        userInfo,
        isProd: envInfo?.name === 'omega2-andromeda',
        LinkComponent: RouterLink,
        additionalLinks: userLinks || [],
      }}
    />
  );
}
