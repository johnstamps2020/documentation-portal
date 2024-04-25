import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { prodDeployEnv } from 'vars';

type UserLinks = { userLinks: { label: string; href: string }[] };

export function useUserLinks(): UserLinks {
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
    return { userLinks: [] };
  }

  if (
    isUserInfoLoading ||
    isUserInfoError ||
    (!userInfo?.isAdmin && !userInfo?.isPowerUser)
  ) {
    return { userLinks: [] };
  }

  if (userInfo.isAdmin) {
    return {
      userLinks: [
        {
          href: '/admin-panel/page',
          label: 'Admin panel',
        },
        {
          href: '/delta-doc',
          label: 'Delta tool',
        },
      ],
    };
  } else {
    return { userLinks: [{ href: '/delta-doc', label: 'Delta tool' }] };
  }
}
