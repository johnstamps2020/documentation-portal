import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import kufriBadge from 'images/badge-kufri.svg';
import jasperBadge from 'images/badge-jasper.svg';
import innsbruckBadge from 'images/badge-innsbruck.svg';
import hakubaBadge from 'images/badge-hakuba.svg';
import garmischBadge from 'images/badge-garmisch.svg';
import flaineBadge from 'images/badge-flaine.svg';
import elysianBadge from 'images/badge-elysian.svg';
import dobsonBadge from 'images/badge-dobson.svg';
import cortinaBadge from 'images/badge-cortina.svg';
import banffBadge from 'images/badge-banff.svg';
import aspenBadge from 'images/badge-aspen.svg';
import { FooterText } from './StyledLayoutComponents';
import { useTheme } from '@mui/material/styles';
import { translate } from '@doctools/components';

export const footerHeight = '55px';

type FooterProps = {
  path?: string;
};
export default function Footer({ path }: FooterProps) {
  const theme = useTheme();
  const releaseInfo = { label: '', badge: '' };

  if (path?.includes('kufri')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.kufri',
      message: 'Kufri Release',
    });
    releaseInfo.badge = kufriBadge;
  } else if (path?.includes('jasper')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.jasper',
      message: 'Jasper Release',
    });
    releaseInfo.badge = jasperBadge;
  } else if (path?.includes('innsbruck')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.innsbruck',
      message: 'Innsbruck Release',
    });
    releaseInfo.badge = innsbruckBadge;
  } else if (path?.includes('hakuba')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.hakuba',
      message: 'Hakuba Release',
    });
    releaseInfo.badge = hakubaBadge;
  } else if (path?.includes('garmisch')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.garmisch',
      message: 'Garmisch Release',
    });
    releaseInfo.badge = garmischBadge;
  } else if (path?.includes('flaine')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.flaine',
      message: 'Flaine Release',
    });
    releaseInfo.badge = flaineBadge;
  } else if (path?.includes('elysian')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.elysian',
      message: 'Elysian Release',
    });
    releaseInfo.badge = elysianBadge;
  } else if (path?.includes('dobson')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.dobson',
      message: 'Dobson Release',
    });
    releaseInfo.badge = dobsonBadge;
  } else if (path?.includes('cortina')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.cortina',
      message: 'Cortina Release',
    });
    releaseInfo.badge = cortinaBadge;
  } else if (path?.includes('banff')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.banff',
      message: 'Banff Release',
    });
    releaseInfo.badge = banffBadge;
  } else if (path?.includes('aspen')) {
    releaseInfo.label = translate({
      id: 'footer.release.label.aspen',
      message: 'Aspen Release',
    });
    releaseInfo.badge = aspenBadge;
  }

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
          Legal and support information
        </FooterText>
      </Link>
      <Stack direction="row" alignItems="center">
        {releaseInfo.badge && (
          <img
            src={releaseInfo.badge}
            alt="ski-release-badge-logo"
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
