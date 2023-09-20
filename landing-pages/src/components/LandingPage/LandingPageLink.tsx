import Button, { ButtonProps } from '@mui/material/Button';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { LandingPageItemData } from 'hooks/useLandingPageItems';
import { Link as RouterLink } from 'react-router-dom';
import InternalTooltip from './InternalTooltip';
import VideoIcon from './VideoIcon';

export type LandingPageLinkProps = {
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

type LandingPageButtonProps = LandingPageLinkProps & {
  variant?: ButtonProps['variant'];
};

export function LandingPageButton({
  landingPageItem,
  sx,
  variant = 'contained',
}: LandingPageButtonProps) {
  if (landingPageItem?.path) {
    return (
      <Button
        LinkComponent={RouterLink}
        href={`/${landingPageItem.path}`}
        variant={variant}
        sx={sx}
      >
        {landingPageItem.label}
      </Button>
    );
  }

  return (
    <Button href={resolveUrl(landingPageItem?.url)} variant={variant} sx={sx}>
      {landingPageItem?.label}
    </Button>
  );
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
      {landingPageItem?.path ? (
        <Link component={RouterLink} to={`/${landingPageItem.path}`} sx={sx}>
          {landingPageItem.label}
        </Link>
      ) : (
        <Link href={resolveUrl(landingPageItem?.url)} sx={sx}>
          {landingPageItem?.label}
        </Link>
      )}
      {landingPageItem?.videoIcon && <VideoIcon />}
      {landingPageItem?.internal && <InternalTooltip />}
    </Stack>
  );
}
