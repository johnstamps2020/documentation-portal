import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import ApplicationDivider from './ApplicationDivider';
import ApplicationNarrowTwoColumnLayout, {
  narrowWidth,
} from './ApplicationNarrowTwoColumnLayout';
import YouTubeVideo from 'components/YouTubeVideo';

function VideoPlaceholder() {
  return (
    <Box
      sx={{
        width: '361px',
        height: '207px',
        backgroundColor: 'lightgray',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <Typography variant="h5" component="div">
        Video coming soon
      </Typography>
      <IconButton
        onClick={() => alert("Don't click here, please")}
        aria-label="Video placeholder trigger button"
      >
        <PlayCircleFilledIcon />
      </IconButton>
    </Box>
  );
}

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
    <Container id="video-section">
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
