import { useUserInfo } from 'hooks/useApi';
import { useNavigate } from 'react-router-dom';

type AdminAccessProps = {
  pagePath: string;
  children: JSX.Element[] | JSX.Element;
};
export default function AdminAccess({ pagePath, children }: AdminAccessProps) {
  const { userInfo, isLoading, isError } = useUserInfo();
  const navigate = useNavigate();
  if (isLoading || isError) {
    return null;
  }
  if (!userInfo?.isLoggedIn) {
    navigate(`/gw-login?redirectTo=${pagePath}`);
  } else if (!userInfo?.isAdmin) {
    navigate(`/forbidden?unauthorized=${pagePath}`);
  }
  return <>{children}</>;
}
