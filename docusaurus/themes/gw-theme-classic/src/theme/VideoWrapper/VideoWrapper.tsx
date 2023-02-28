import React from 'react';
import Iframe from '@theme/Iframe';
import BrightcoveVideo from '@theme/BrightcoveVideo';
import TranscriptDownloadButton from '@theme/TranscriptDownloadButton/TranscriptDownloadButton';
import { VideoObject } from '@theme/VideoWrapper';

export default function VideoWrapper({
  transcript,
  ariaLabelForDownload,
  src,
  videoId,
  width,
}: VideoObject) {
  return (
    <div style={{ width: width ? width : '100%' }}>
      {src && <Iframe src={src} />}
      {videoId && <BrightcoveVideo videoId={videoId} />}
      {transcript && ariaLabelForDownload && (
        <TranscriptDownloadButton
          transcript={transcript}
          ariaLabelForDownload={ariaLabelForDownload}
        />
      )}
    </div>
  );
}
