import { VersionSelector } from '@doctools/core';
import React from 'react';
import { createRoot } from 'react-dom/client';

export async function addVersionSelector() {
  try {
    const matchingVersionSelector = window.matchingVersionSelector;

    if (!matchingVersionSelector) {
      return;
    }

    const versionSelectorContainer = document.getElementById('headerRight');

    if (versionSelectorContainer) {
      const versionSelectorRoot = createRoot(versionSelectorContainer);
      versionSelectorRoot.render(
        <VersionSelector
          availableVersions={matchingVersionSelector.allVersions}
        />
      );
    }
  } catch (err) {
    console.error(err);
    return;
  }
}
