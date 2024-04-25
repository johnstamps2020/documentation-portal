import { useUserInfo } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AccessControlProps = {
  pagePath: string;
  checkAdminAccess: boolean;
  checkPowerUserAccess: boolean;
  children: JSX.Element[] | JSX.Element;
};
export default function AccessControl({
  pagePath,
  children,
  checkAdminAccess,
  checkPowerUserAccess,
}: AccessControlProps) {
  const { userInfo, isLoading, isError } = useUserInfo();
  const navigate = useNavigate();
  const [adminHasAccess, setAdminHasAccess] = useState<boolean>();
  const [powerUserHasAccess, setPowerUserHasAccess] = useState<boolean>();

  useEffect(() => {
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
  ]);

  if (isLoading || isError) {
    return null;
  }

  if (powerUserHasAccess === false && adminHasAccess === false) {
    navigate(`/forbidden?unauthorized=${pagePath}`);
  }

  return <>{children}</>;
}
