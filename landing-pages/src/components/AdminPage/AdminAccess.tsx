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
    if (userInfo && !userInfo.isLoggedIn) {
      navigate(`/gw-login?redirectTo=${pagePath}`);
    } else if (userInfo && !userInfo.isAdmin) {
      navigate(`/forbidden?unauthorized=${pagePath}`);
    }
  }, [navigate, userInfo, userInfo?.isLoggedIn, userInfo?.isAdmin, pagePath]);

  if (isLoading || isError) {
    return null;
  }

  return <>{children}</>;
}
