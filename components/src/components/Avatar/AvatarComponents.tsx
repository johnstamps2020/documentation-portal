import React from 'react';
import { useAvatar } from './AvatarContext';
import { LoginButton } from './LoginButton';
import { AvatarButtonWithMenu } from './AvatarButtonWithMenu';

export function AvatarComponents() {
  const { userInfo } = useAvatar();
  console.log('Rendering the avatar', userInfo);

  if (!userInfo?.isLoggedIn) {
    return <LoginButton />;
  }

  return <AvatarButtonWithMenu />;
}
