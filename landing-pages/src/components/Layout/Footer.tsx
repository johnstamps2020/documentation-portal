import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from '@tanstack/react-router';
import { useIntl } from 'react-intl';
import { FooterText } from './StyledLayoutComponents';

export const footerHeight = '55px';

type FooterProps = {
  path?: string;
};
export default function Footer({ path }: FooterProps) {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <Stack
      direction="row"
      height={footerHeight}
      maxHeight={footerHeight}
      flexWrap="wrap"
      sx={{
        position: 'relative', // for zIndex to work
        backgroundColor: 'hsl(216, 42%, 13%)',
        color: 'hsl(0, 0%, 98%)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <FooterText sx={{ display: 'contents' }}>
        © 2024 Guidewire Software, Inc.
      </FooterText>
      <Link
        component={RouterLink}
        to="/support"
        sx={{
          underline: 'none',
          color: 'white',
        }}
      >
        <FooterText sx={{ display: 'contents' }}>
          {intl.formatMessage({
            id: 'footer.legal.linktext',
            defaultMessage: 'Legal and support information',
          })}
        </FooterText>
      </Link>
    </Stack>
  );
}
