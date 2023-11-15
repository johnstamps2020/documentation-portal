import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useUserInfo } from 'hooks/useApi';
import { Link as RouterLink } from 'react-router-dom';

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
        borderWidth: '0.5px',
        borderStyle: 'solid',
        borderColor: 'divider',
        borderRadius: '4px',
        px: '32px',
        py: '10px',
        width: 'fit-content',
        ...styles,
      }}
    >
      <Typography>
        You are viewing limited content. To access all documentation, please{' '}
        <Link
          component={RouterLink}
          to="/gw-login"
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
