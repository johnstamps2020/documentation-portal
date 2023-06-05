import React from 'react';
import HeadingButton from './HeadingButton';

type CloseButtonProps = {
  handleClose: () => void;
};

export default function CloseButton({ handleClose }: CloseButtonProps) {
  return <HeadingButton onClick={handleClose}>❌ close</HeadingButton>;
}
