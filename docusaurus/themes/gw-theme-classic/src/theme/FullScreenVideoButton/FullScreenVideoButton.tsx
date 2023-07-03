import React, { useState } from 'react';
import styles from './FullScreenVideoPlayer.module.css';
import Button from '@mui/material/Button';
import VideoWrapper, { VideoObject } from '@theme/VideoWrapper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

type FullScreenVideoButtonProps = VideoObject & {
  thumbnail: React.ReactNode;
};

export default function FullScreenVideoButton(
  props: FullScreenVideoButtonProps
) {
  const [open, setOpen] = useState(false);
  const buttonTitle = `Play video "${props.title}"`;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle id="alert-dialog-title">{buttonTitle}</DialogTitle>
        <DialogContent>
          <VideoWrapper {...props} />
          <Button onClick={handleClose}>Close video</Button>
        </DialogContent>
      </Dialog>
      <Button
        title={buttonTitle}
        onClick={handleClickOpen}
        className={styles.thumbnailButton}
      >
        {props.thumbnail}
      </Button>
    </>
  );
}
