import LaunchIcon from '@mui/icons-material/Launch';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Link, { LinkProps } from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from '@tanstack/react-router';
import { LandingPageItemData } from 'helpers/landingPageHelpers';
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
        component={RouterLink}
        to={`/${landingPageItem.path}`}
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
  const showExternalIcon = landingPageItem.url?.startsWith('http');

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
        <Link
          href={resolveUrl(landingPageItem?.url)}
          target={showExternalIcon ? '_blank' : undefined}
          sx={sx}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box>{landingPageItem?.label}</Box>
            {showExternalIcon && !landingPageItem.videoIcon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LaunchIcon sx={sx} />
              </Box>
            )}
          </Stack>
        </Link>
      )}
      {landingPageItem?.videoIcon && <VideoIcon />}
      {landingPageItem?.internal && <InternalTooltip />}
    </Stack>
  );
}
