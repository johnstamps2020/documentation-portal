import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';
import React, { useEffect } from 'react';
import AdminControls from '../AdminControls';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import LandingPageLink from '../LandingPageLink';
import heroImage from './application-hero.png';

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
  const { allAvailableItems } = useLandingPageItemsContext();

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  const matchingItem = allAvailableItems
    ? findMatchingPageItemData(allAvailableItems, buttonProps)
    : undefined;

  const heroButtonItem = matchingItem
    ? {
        ...matchingItem,
        label: buttonProps.label,
        internal: matchingItem?.internal || false,
      }
    : undefined;

  return (
    <Box
      sx={{
        py: '28px',
        position: 'relative',
        minHeight: 220,
        backgroundColor: 'primary.main',
        color: 'white',
        background: `url("${heroImage}") lightgray 50% / cover no-repeat`,
      }}
      id="application-hero"
    >
      <Container>
        <AdminControls />
        <Box sx={{ flex: 1 }}>
          <Stack
            gap={3}
            justifyContent="space-between"
            height="100%"
            sx={{ pb: '16px' }}
          >
            <Stack sx={{ gap: '16px' }}>
              <Typography
                variant="h1"
                sx={{ lineHeight: 1.25, fontSize: 36, fontWeight: 600 }}
              >
                {title}
              </Typography>
              {heroDescription && (
                <Box
                  sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    width: '740px',
                    maxWidth: '100%',
                  }}
                >
                  {heroDescription}
                </Box>
              )}
            </Stack>
            <Box>
              {heroButtonItem && (
                <LandingPageLink
                  landingPageItem={heroButtonItem}
                  sx={{
                    display: 'flex',
                    width: 'fit-content',
                    backgroundColor: 'white',
                    color: 'primary.main',
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
              )}
            </Box>
            <NotLoggedInInfo styles={{ color: 'white' }} />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
