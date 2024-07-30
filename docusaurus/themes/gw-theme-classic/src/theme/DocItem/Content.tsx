import InitialDocItemContent from '@theme-init/DocItem/Content';
import Internal from '@theme/Internal';
import PublicBadge from '@theme/PublicBadge';
import React from 'react';

export default function Content(props) {
  return (
    <>
      <Internal hidePrompt>
        <PublicBadge />
      </Internal>
      <InitialDocItemContent {...props} />
    </>
  );
}
