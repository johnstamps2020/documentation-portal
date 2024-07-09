import { EnvName, UserInfo } from '@doctools/components';
import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    if (envInfoLoading || userInfoLoading) {
      return;
    }
    if (userInfo && envInfo && envInfo.name) {
      const elementAllowedOnThisEnv = checkIfElementIsAllowedOnThisEnv(
        allowedOnEnvs,
        envInfo.name
      );
      console.log(elementAllowedOnThisEnv);
      const userAllowedToAccessPage = checkIfUserCanAccess(
        userInfo,
        accessLevel
      );
      console.log(userAllowedToAccessPage);
      if (elementAllowedOnThisEnv && userAllowedToAccessPage) {
        setAllowedToSee(true);
      }
    } else {
      setAllowedToSee(false);
      if (doNotNavigate !== true) {
        navigate(`/forbidden?unauthorized=${pagePath}`);
      }
    }
  }, [
    userInfo,
    userInfoLoading,
    envInfo,
    envInfoLoading,
    allowedOnEnvs,
    accessLevel,
    navigate,
    pagePath,
    doNotNavigate,
  ]);

  if (userInfoLoading || userInfoError || envInfoLoading || envInfoError) {
    return null;
  }

  if (allowedToSee === false) {
    return null;
  }

  return <>{children}</>;
}
