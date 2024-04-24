import React from 'react';
import { useAvatar } from './AvatarContext';
import { LoginButton } from './LoginButton';
import { AvatarButtonWithMenu } from './AvatarButtonWithMenu';

export function AvatarComponents() {
  const { userInfo } = useAvatar();

  if (!userInfo?.isLoggedIn) {
    return <LoginButton />;
  }

  return <AvatarButtonWithMenu />;
}
