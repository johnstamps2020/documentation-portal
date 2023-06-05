import React from 'react';
import HeadingButton from './HeadingButton';

type BackButtonProps = {
  handleBack: () => void;
};

export default function BackButton({ handleBack }: BackButtonProps) {
  return <HeadingButton onClick={handleBack}>&lt; back</HeadingButton>;
}
