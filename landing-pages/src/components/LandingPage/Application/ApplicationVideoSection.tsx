import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import YouTubeVideo from 'components/YouTubeVideo';
import React from 'react';
import ApplicationDivider from './ApplicationDivider';
import { narrowWidth } from './ApplicationNarrowTwoColumnLayout';

export type ApplicationVideoSectionProps = {
  title: string;
  description: React.ReactNode;
  videoUrl: string;
};

export default function ApplicationVideoSection({
  title,
  description,
  videoUrl,
}: ApplicationVideoSectionProps) {
  return (
    <Container id="video-section" sx={{ pt: '25px' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: narrowWidth,
          mx: 'auto',
          my: '75px',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: '16px', sm: '16px', md: '140px' },
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontSize: '24px',
              lineHeight: '30px',
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          <Typography component="div" sx={{ fontSize: '14px' }}>
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <YouTubeVideo srcUrl={videoUrl} />
        </Box>
      </Box>
      <ApplicationDivider />
    </Container>
  );
}
