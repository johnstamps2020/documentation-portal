import { EnvName, UserInfo } from '@doctools/server';
import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AccessLevel = 'admin' | 'power-user' | 'everyone';

type AccessControlProps = {
  accessLevel: AccessLevel;
  allowedOnEnvs?: EnvName[];
  children: JSX.Element[] | JSX.Element;
};

function checkIfUserCanAccess(
  userInfo: UserInfo,
  accessLevel: AccessLevel
): boolean {
  // page does no require special access rights,
  // so it's okay for anyone to view it, even if they are not logged in
  if (accessLevel === 'everyone') {
    return true;
  }

  // since this page requires special rights to be accessed,
  // user needs to be logged in to view it
  if (!userInfo || !userInfo.isLoggedIn) {
    return false;
  }

  // if page requires power user, the user needs to be a power user or an admin to view it
  if (
    accessLevel === 'power-user' &&
    (userInfo.isPowerUser || userInfo.isAdmin)
  ) {
    return true;
  }

  // if page requires admin, the user needs to be an admin to view it
  if (accessLevel === 'admin' && userInfo.isAdmin) {
    return true;
  }

  // block access in all other cases:
  return false;
}

function checkIfPageIsAllowedOnThisEnv(
  requestedEnvNames: AccessControlProps['allowedOnEnvs'],
  currentEnvName: EnvName
): boolean {
  // no env name requested, so the page can be viewed on any nev
  if (!requestedEnvNames) {
    return true;
  }

  // requested env name, so check if it matches
  if (requestedEnvNames.includes(currentEnvName)) {
    return true;
  }

  // block access in all other cases
  return false;
}

export default function AccessControl({
  children,
  accessLevel,
  allowedOnEnvs,
}: AccessControlProps) {
  const {
    envInfo,
    isError: envInfoError,
    isLoading: envInfoLoading,
  } = useEnvInfo();
  const {
    userInfo,
    isLoading: userInfoLoading,
    isError: userInfoError,
  } = useUserInfo();

  const pagePath = window.location.href;
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && envInfo && envInfo.name) {
      const pageAllowedOnThisEnv = checkIfPageIsAllowedOnThisEnv(
        allowedOnEnvs,
        envInfo.name
      );
      const userAllowedToAccessPage = checkIfUserCanAccess(
        userInfo,
        accessLevel
      );

      if (!pageAllowedOnThisEnv || !userAllowedToAccessPage) {
        navigate(`/forbidden?unauthorized=${pagePath}`);
      }
    }
  }, [userInfo, envInfo, allowedOnEnvs, accessLevel, navigate, pagePath]);

  if (userInfoLoading || userInfoError || envInfoLoading || envInfoError) {
    return null;
  }

  return <>{children}</>;
}
