import { HighlightButton } from '@doctools/components';
import React from 'react';
import { createRoot } from 'react-dom/client';

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

export function addHighlightButton() {
  const params = getSearchParams();
  if (params.has('hl')) {
    const words = params.get('hl').split(',');
    if (words.length === 0) {
      return;
    }
    const navbarRight = document.querySelector('#navbarRight');
    const buttonHolder = document.createElement('div');
    buttonHolder.id = 'highlightButton';
    if (navbarRight) {
      navbarRight.appendChild(buttonHolder);
      const buttonRoot = createRoot(buttonHolder);
      buttonRoot.render(
        <HighlightButton
          words={words}
          activeColor="black"
          inactiveColor="gray"
        />
      );
    }
  }
}
