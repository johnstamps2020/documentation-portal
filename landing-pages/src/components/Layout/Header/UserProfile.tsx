import { Avatar, useEnvStore } from '@doctools/core';
import { Link as RouterLink } from '@tanstack/react-router';
import { useUserInfo } from 'hooks/useApi';

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
