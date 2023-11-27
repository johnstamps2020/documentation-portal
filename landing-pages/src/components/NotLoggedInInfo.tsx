import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useUserInfo } from 'hooks/useApi';
import { Link as RouterLink } from 'react-router-dom';
import { getRedirectToPath } from 'helpers/navigationHelpers';

type NotLoggedInInfoProps = {
  styles?: BoxProps['sx'];
};

export default function NotLoggedInInfo({ styles }: NotLoggedInInfoProps) {
  const { userInfo, isError, isLoading } = useUserInfo();

  if (isError || isLoading || !userInfo || userInfo.isLoggedIn) {
    return null;
  }

  return (
    <Box
      sx={{
        ...styles,
      }}
    >
      <Typography>
        You are viewing limited content. To access all documentation, please{' '}
        <Link
          component={RouterLink}
          to={`/gw-login?redirectTo=${getRedirectToPath()}`}
          sx={{
            ...styles,
            textDecoration: 'underline',
          }}
        >
          LOG IN
        </Link>
        .
      </Typography>
    </Box>
  );
}
