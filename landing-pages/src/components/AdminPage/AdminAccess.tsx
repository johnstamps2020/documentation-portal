import { useUserInfo } from 'hooks/useApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminAccessProps = {
  pagePath: string;
  children: JSX.Element[] | JSX.Element;
};
export default function AdminAccess({ pagePath, children }: AdminAccessProps) {
  const { userInfo, isLoading, isError } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isLoggedIn === false) {
      navigate(`/gw-login?redirectTo=${pagePath}`);
    } else if (userInfo && userInfo.isAdmin === false) {
      navigate(`/forbidden?unauthorized=${pagePath}`);
    }
  }, [userInfo?.isLoggedIn, userInfo?.isAdmin, pagePath]);

  if (isLoading || isError) {
    return null;
  }

  return <>{children}</>;
}
