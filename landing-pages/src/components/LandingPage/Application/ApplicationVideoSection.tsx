import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import ApplicationDivider from './ApplicationDivider';
import ApplicationNarrowTwoColumnLayout from './ApplicationNarrowTwoColumnLayout';

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
  videoId?: string;
};

export default function ApplicationVideoSection({
  title,
  description,
  videoId,
}: ApplicationVideoSectionProps) {
  return (
    <Container id="video-section">
      <ApplicationNarrowTwoColumnLayout
        left={
          <>
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
          </>
        }
        right={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {videoId ? <div>{videoId}</div> : <VideoPlaceholder />}
          </Box>
        }
      />
      <ApplicationDivider />
    </Container>
  );
}
