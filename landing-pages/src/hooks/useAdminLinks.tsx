import { HeaderMenuLinkProps } from 'components/Layout/StyledLayoutComponents';
import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { prodDeployEnv } from 'vars';

type AdminLinks = { adminLinks: HeaderMenuLinkProps[] };

export function useAdminLinks(): AdminLinks {
  const {
    userInfo,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
  } = useUserInfo();
  const {
    envInfo,
    isLoading: isEnvInfoLoading,
    isError: isEnvInfoError,
  } = useEnvInfo();

  if (isEnvInfoLoading || isEnvInfoError || envInfo?.name === prodDeployEnv) {
    return { adminLinks: [] };
  }

  if (isUserInfoLoading || isUserInfoError || !userInfo?.isAdmin) {
    return { adminLinks: [] };
  }

  return {
    adminLinks: [
      {
        href: '/admin-panel',
        children: 'Admin panel',
      },
    ],
  };
}
