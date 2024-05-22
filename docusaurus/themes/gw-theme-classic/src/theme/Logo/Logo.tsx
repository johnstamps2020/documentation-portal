import React from 'react';
import BigLogo from './guidewire-doc-logo.svg';
import SmallLogo from './g-bug.svg';
import useIsMobile from '../../hooks/useIsMobile';
import { Init } from '@doctools/components';

export default function Logo() {
  const isMobile = useIsMobile();

  return (
    <>
      <Init />
      <a
        href="/"
        style={{
          position: 'relative',
          zIndex: '200',
        }}
      >
        {isMobile ? <SmallLogo /> : <BigLogo width={293} height={32} />}
      </a>
    </>
  );
}
