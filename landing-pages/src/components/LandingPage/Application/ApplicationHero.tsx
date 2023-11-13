import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ReactComponent as HeroImage } from './application-hero-image.svg';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import LandingPageItemRenderer from 'components/LandingPage/LandingPageItemRenderer';
import Skeleton from '@mui/material/Skeleton';
import LandingPageLink from '../LandingPageLink';
import { arrangeItems } from 'helpers/landingPageHelpers';

export type ApplicationHeroProps = {
  buttonProps: LandingPageItemProps;
  title: string;
};

export default function ApplicationHero({
  buttonProps,
  title,
}: ApplicationHeroProps) {
  const { setTitle } = useLayoutContext();
  const { isError, isLoading, landingPageItems } = useLandingPageItems([
    buttonProps,
  ]);
  const arrangedItems = arrangeItems([buttonProps], landingPageItems);

  const linkButton = (
    <LandingPageLink
      landingPageItem={arrangedItems[0]}
      sx={{
        display: 'flex',
        width: 'fit-content',
        backgroundColor: 'white',
        color: 'primary.main',
        borderRadius: 2.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: 14,
        px: 3.5,
        py: 0.5,
        ':hover': {
          color: 'white',
          backgroundColor: 'primary.dark',
        },
      }}
    />
  );

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  return (
    <Box
      sx={{
        pt: '26px',
        position: 'relative',
        minHeight: 220,
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container>
        <Grid container justifyContent="space-between">
          <Grid sx={{ maxWidth: '466px' }}>
            <Stack
              gap={3}
              justifyContent="space-between"
              height="100%"
              sx={{ pb: '8px' }}
            >
              <Typography variant="h1" sx={{ lineHeight: 1.4, fontSize: 30 }}>
                {title}
              </Typography>
              <Box>
                <LandingPageItemRenderer
                  isError={isError}
                  isLoading={isLoading}
                  landingPageItems={landingPageItems}
                  skeleton={<Skeleton />}
                  item={linkButton}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid alignSelf="flex-end">
            <HeroImage height={170} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
