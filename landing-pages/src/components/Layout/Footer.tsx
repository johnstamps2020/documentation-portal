import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import garmischBadge from '../../images/badge-garmisch.svg';
import flaineBadge from '../../images/badge-flaine.svg';
import elysianBadge from '../../images/badge-elysian.svg';
import dobsonBadge from '../../images/badge-dobson.svg';
import cortinaBadge from '../../images/badge-cortina.svg';
import banffBadge from '../../images/badge-banff.svg';
import aspenBadge from '../../images/badge-aspen.svg';
import { FooterText } from './StyledLayoutComponents';

export const footerHeight = '55px';

type FooterProps = {
  path?: string;
};
export default function Footer({ path }: FooterProps) {
  const releaseInfo = { label: '', badge: '' };
  if (path?.includes('garmisch')) {
    releaseInfo.label = 'Garmisch Release';
    releaseInfo.badge = garmischBadge;
  } else if (path?.includes('flaine')) {
    releaseInfo.label = 'Flaine Release';
    releaseInfo.badge = flaineBadge;
  } else if (path?.includes('elysian')) {
    releaseInfo.label = 'Elysian Release';
    releaseInfo.badge = elysianBadge;
  } else if (path?.includes('dobson')) {
    releaseInfo.label = 'Dobson Release';
    releaseInfo.badge = dobsonBadge;
  } else if (path?.includes('cortina')) {
    releaseInfo.label = 'Cortina Release';
    releaseInfo.badge = cortinaBadge;
  } else if (path?.includes('banff')) {
    releaseInfo.label = 'Banff Release';
    releaseInfo.badge = banffBadge;
  } else if (path?.includes('aspen')) {
    releaseInfo.label = 'Aspen Release';
    releaseInfo.badge = aspenBadge;
  }
  return (
    <Stack
      direction="row"
      height={footerHeight}
      maxHeight={footerHeight}
      sx={{
        backgroundColor: 'hsl(216, 42%, 13%)',
        color: 'hsl(0, 0%, 98%)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
      }}
    >
      <FooterText sx={{ display: 'contents' }}>
        Copyright © 2023 Guidewire Software, Inc.
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
          Legal and support information
        </FooterText>
      </Link>
      <Stack direction="row" alignItems="center">
        {releaseInfo.badge && (
          <img
            src={releaseInfo.badge}
            alt="elysian-badge-logo"
            style={{
              height: '20px',
              display: 'block',
              marginRight: '5px',
            }}
          />
        )}
        <FooterText sx={{ display: 'contents' }}>
          {releaseInfo.label}
        </FooterText>
      </Stack>
    </Stack>
  );
}
