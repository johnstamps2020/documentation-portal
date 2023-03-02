import Stack from '@mui/material/Stack';
import { LandingPageItemData } from '../../hooks/useLandingPageItems';
import Link, { LinkProps } from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import InternalTooltip from './InternalTooltip';

type LandingPageLinkProps = {
  landingPageItem: LandingPageItemData;
  sx?: LinkProps['sx'];
};

function resolveUrl(srcUrl: string | undefined) {
  if (!srcUrl) {
    return '/';
  }
  const isAbsoluteUrl = srcUrl.startsWith('http') || srcUrl.startsWith('/');
  return isAbsoluteUrl ? srcUrl : `/${srcUrl}`;
}

export default function LandingPageLink({
  landingPageItem,
  sx,
}: LandingPageLinkProps) {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {landingPageItem.path ? (
        <Link
          component={RouterLink}
          to={`/${landingPageItem.path}`}
          sx={sx}
        >
          {landingPageItem.label}
        </Link>
      ) : (
        <Link href={resolveUrl(landingPageItem.url)} sx={sx}>
          {landingPageItem.label}
        </Link>
      )}
      {landingPageItem.internal && (
        <InternalTooltip key={landingPageItem.label} />
      )}
    </Stack>
  );
}
