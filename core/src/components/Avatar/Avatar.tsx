import React from 'react';
import { AvatarComponents } from './AvatarComponents';
import { AvatarInitialValue, AvatarProvider } from './AvatarContext';

type AvatarProps = {
  initialValue: AvatarInitialValue;
};

export function Avatar({ initialValue }: AvatarProps) {
  return (
    <AvatarProvider initialValue={initialValue}>
      <AvatarComponents />
    </AvatarProvider>
  );
}
