import { EnvName, useEnvStore, UserInfo } from '@doctools/core';
import { useUserInfo } from 'hooks/useApi';
import { useEffect, useState } from 'react';

type AccessLevel = 'admin' | 'power-user' | 'everyone';

type AccessControlProps = {
  accessLevel: AccessLevel;
  allowedOnEnvs?: EnvName[];
  doNotNavigate?: boolean;
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

function checkIfElementIsAllowedOnThisEnv(
  requestedEnvNames: AccessControlProps['allowedOnEnvs'],
  currentEnvName: EnvName
): boolean {
  // no env name requested, so the page can be viewed on any nev
  if (!requestedEnvNames || requestedEnvNames.length === 0) {
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
  doNotNavigate,
}: AccessControlProps) {
  const [allowedToSee, setAllowedToSee] = useState<boolean>(false);
  const envName = useEnvStore((state) => state.envName);
  const {
    userInfo,
    isLoading: userInfoLoading,
    isError: userInfoError,
  } = useUserInfo();

  const pagePath = window.location.pathname;

  useEffect(() => {
    function doNotAllow() {
      setAllowedToSee(false);
      if (doNotNavigate !== true) {
        window.location.replace(`/forbidden?unauthorized=${pagePath}`);
      }
    }

    if (userInfoLoading || userInfoError || !envName) {
      return;
    }

    if (userInfo) {
      const elementAllowedOnThisEnv = checkIfElementIsAllowedOnThisEnv(
        allowedOnEnvs,
        envName
      );
      const userAllowedToAccessPage = checkIfUserCanAccess(
        userInfo,
        accessLevel
      );
      if (elementAllowedOnThisEnv && userAllowedToAccessPage) {
        setAllowedToSee(true);
      } else {
        doNotAllow();
      }
    } else {
      doNotAllow();
    }
  }, [
    userInfo,
    envName,
    allowedOnEnvs,
    accessLevel,
    pagePath,
    doNotNavigate,
    userInfoLoading,
    userInfoError,
  ]);

  if (allowedToSee === false) {
    return null;
  }

  return <>{children}</>;
}
