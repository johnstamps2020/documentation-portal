import Stack from '@mui/material/Stack';
import { useLandingPageItemData } from '../../hooks/useLandingPageItemData';
import { LandingPageItem } from '../../pages/LandingPage/LandingPage';
import Link, { LinkProps } from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import InternalTooltip from './InternalTooltip';

type LandingPageLinkProps = {
  item: LandingPageItem;
  sx?: LinkProps['sx'];
};

function resolveUrl(srcUrl: string | undefined) {
  if (!srcUrl) {
    return '/';
  }
  const isAbsoluteUrl = srcUrl.startsWith('http') || srcUrl.startsWith('/');
  return isAbsoluteUrl ? srcUrl : `/${srcUrl}`;
}

export default function LandingPageLink({ item, sx }: LandingPageLinkProps) {
  const { landingPageItemData, isError, isLoading } =
    useLandingPageItemData(item);
  if (isError || isLoading || !landingPageItemData) {
    return null;
  }

  const label =
    item.label || landingPageItemData.label || landingPageItemData.title;
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {landingPageItemData.path ? (
        <Link
          component={RouterLink}
          to={`/${landingPageItemData.path}`}
          sx={sx}
        >
          {label}
        </Link>
      ) : (
        <Link href={resolveUrl(landingPageItemData.url)} sx={sx}>
          {label}
        </Link>
      )}
      {landingPageItemData.internal && <InternalTooltip key={label} />}
    </Stack>
  );
}
