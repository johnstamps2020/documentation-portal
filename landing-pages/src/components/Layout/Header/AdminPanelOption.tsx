import MenuItem from '@mui/material/MenuItem';
import { HeaderMenuLink } from 'components/Layout/StyledLayoutComponents';
import { useEnvInfo, useUserInfo } from '../../../hooks/useApi';
import { prodDeployEnv } from '../../../vars';

export default function AdminPanelOption() {
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
    return null;
  }

  if (isUserInfoLoading || isUserInfoError || !userInfo?.isAdmin) {
    return null;
  }
  return (
    <MenuItem sx={{ width: 'fit-content' }}>
      <HeaderMenuLink href="/admin-panel">Admin panel</HeaderMenuLink>
    </MenuItem>
  );
}
