import { Avatar, useEnvStore } from '@doctools/components';
import { useUserInfo } from 'hooks/useApi';
import { Link as RouterLink } from 'react-router-dom';

export default function UserProfile() {
  const { userInfo, isError, isLoading } = useUserInfo();
  const envName = useEnvStore((state) => state.envName);

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
        isProd: envName === 'omega2-andromeda',
        LinkComponent: RouterLink,
      }}
    />
  );
}
