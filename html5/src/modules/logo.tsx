import { Init, translate } from '@doctools/components';
import React from 'react';
import { createRoot } from 'react-dom/client';

export function addLogo() {
  try {
    const logoContainer = document.createElement('div');
    const headerLeft = document.getElementById('headerLeft');
    headerLeft.appendChild(logoContainer);

    const logoRoot = createRoot(logoContainer);
    const logoLabel = translate({
      id: 'logo.label',
      message: 'Home',
    });

    logoRoot.render(
      <>
        <Init />
        <a href="/" aria-label={logoLabel} className="logo" />
      </>
    );
  } catch (error) {
    console.error(error);
  }
}
