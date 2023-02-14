import React from 'react';
import PlayButton from './PlayButton.svg';

export default function VideoThumbnail({
  src,
  Svg,
  imageStyle,
  playButtonStyle,
}) {
  return (
    <div style={{ position: 'relative' }}>
      {src && <img src={src} alt="" style={{ ...imageStyle }} />}
      {Svg && Svg}
      <PlayButton
        style={{
          position: 'absolute',
          right: '6%',
          bottom: '6%',
          ...playButtonStyle,
        }}
      />
    </div>
  );
}
