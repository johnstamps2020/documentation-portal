import React from 'react';
import { useAvatar } from './AvatarContext';
import { LoginButton } from './LoginButton';

export function AvatarComponents() {
  const { userInfo } = useAvatar();

  if (!userInfo?.isLoggedIn) {
    return <LoginButton />;
  }

  return <div>user avatar</div>;
}
