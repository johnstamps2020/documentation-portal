import { EnvInfo } from '@doctools/server';
import { useEnvInfo, useUserInfo } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AccessControlProps = {
  pagePath: string;
  checkAdminAccess: boolean;
  checkPowerUserAccess: boolean;
  children: JSX.Element[] | JSX.Element;
  allowedOnEnv?: EnvInfo['name'];
};
export default function AccessControl({
  pagePath,
  children,
  checkAdminAccess,
  checkPowerUserAccess,
  allowedOnEnv,
}: AccessControlProps) {
  const {
    envInfo,
    isError: envInfoError,
    isLoading: envInfoLoading,
  } = useEnvInfo();
  const { userInfo, isLoading, isError } = useUserInfo();
  const navigate = useNavigate();
  const [adminHasAccess, setAdminHasAccess] = useState<boolean>();
  const [powerUserHasAccess, setPowerUserHasAccess] = useState<boolean>();
  const [pageAllowedOnThisEnv, setPageAllowedOnThisEnv] = useState<boolean>();

  useEffect(() => {
    if (allowedOnEnv && envInfo && allowedOnEnv === envInfo.name) {
      setPageAllowedOnThisEnv(true);
    }
    if (!checkAdminAccess) {
      setAdminHasAccess(false);
    }
    if (!checkPowerUserAccess) {
      setPowerUserHasAccess(false);
    }
    if (userInfo) {
      if (!userInfo.isLoggedIn) {
        navigate(`/gw-login?redirectTo=${pagePath}`);
      }
      if (checkAdminAccess) {
        setAdminHasAccess(userInfo.isAdmin);
      }
      if (checkPowerUserAccess) {
        setPowerUserHasAccess(userInfo.isPowerUser);
      }
    }
  }, [
    navigate,
    userInfo,
    userInfo?.isLoggedIn,
    userInfo?.isAdmin,
    userInfo?.isPowerUser,
    pagePath,
    checkAdminAccess,
    checkPowerUserAccess,
    envInfo,
    allowedOnEnv,
  ]);

  if (isLoading || isError || envInfoError || envInfoLoading) {
    return null;
  }

  if (
    pageAllowedOnThisEnv === false &&
    powerUserHasAccess === false &&
    adminHasAccess === false
  ) {
    navigate(`/forbidden?unauthorized=${pagePath}`);
  }

  return <>{children}</>;
}
