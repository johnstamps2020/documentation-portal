import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import LandingPageItemRenderer from 'components/LandingPage/LandingPageItemRenderer';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { arrangeItems } from 'helpers/landingPageHelpers';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import React, { useEffect } from 'react';
import LandingPageLink from '../LandingPageLink';
import { ReactComponent as HeroImage } from './application-hero-image.svg';

export type ApplicationHeroProps = {
  buttonProps: LandingPageItemProps;
  title: string;
  heroDescription?: React.ReactNode;
};

export default function ApplicationHero({
  buttonProps,
  title,
  heroDescription,
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
      id="application-hero"
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            height: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack
              gap={3}
              justifyContent="space-between"
              height="100%"
              sx={{ pb: '8px' }}
            >
              <Typography variant="h1" sx={{ lineHeight: 1.4, fontSize: 30 }}>
                {title}
              </Typography>
              {heroDescription && (
                <Box
                  sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}
                >
                  {heroDescription}
                </Box>
              )}
              <Box>
                <LandingPageItemRenderer
                  isError={isError}
                  isLoading={isLoading}
                  landingPageItems={landingPageItems}
                  skeleton={<Skeleton />}
                  item={linkButton}
                />
              </Box>
              <NotLoggedInInfo styles={{ color: 'white' }} />
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
            }}
          >
            <HeroImage height={170} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
