import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { FooterText } from './StyledLayoutComponents';
import { useTheme } from '@mui/material/styles';
import { translate } from '@doctools/components';

export const footerHeight = '55px';

type FooterProps = {
  path?: string;
};
export default function Footer({ path }: FooterProps) {
  const theme = useTheme();

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
        Copyright © 2024 Guidewire Software, Inc.
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
          {translate({
            id: 'footer.legal.linktext',
            message: 'Legal and support information',
          })}
        </FooterText>
      </Link>
    </Stack>
  );
}
