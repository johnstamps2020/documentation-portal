import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useUserInfo } from 'hooks/useApi';
import { SxProps, Theme } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

type NotLoggedInInfoProps = {
  styles?: SxProps<Theme>;
};

export default function NotLoggedInInfo({ styles }: NotLoggedInInfoProps) {
  const { userInfo, isError, isLoading } = useUserInfo();

  if (isError || isLoading || !userInfo || userInfo.isLoggedIn) {
    return null;
  }

  return (
    <Stack direction="row" gap="8px">
      <Typography sx={{ ...styles }}>Note:</Typography>
      <Box>
        <Typography sx={{ ...styles }}>
          You are viewing limited content.
        </Typography>
        <Typography sx={{ ...styles }}>
          To access all the documentation, please{' '}
          <Link
            component={RouterLink}
            to="/gw-login"
            sx={{
              ...styles,
              textDecoration: 'underline',
            }}
          >
            log in
          </Link>
          .
        </Typography>
      </Box>
    </Stack>
  );
}
