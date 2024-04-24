import { Avatar } from '@doctools/components';
import React from 'react';
import { createRoot } from 'react-dom/client';

export function addAvatar() {
  try {
    const avatarContainer = document.createElement('div');
    document.getElementById('headerRight').appendChild(avatarContainer);
    const avatarRoot = createRoot(avatarContainer);

    avatarRoot.render(
      <Avatar
        initialValue={{
          userInfo: window.userInformation,
          isProd: window.location.hostname === 'docs.guidewire.com',
        }}
      />
    );
  } catch (error) {
    console.error(error);
  }
}
