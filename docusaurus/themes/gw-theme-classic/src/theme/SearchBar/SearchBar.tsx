import { VersionSelector } from '@doctools/core';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Avatar from '@theme/Avatar';
import { useDocContext } from '@theme/DocContext';
import DocHighlighter from '@theme/DocHighlighter/DocHighlighter';
import GwSearchForm from '@theme/GwSearchForm/';
import InternalBadge from '@theme/InternalBadge/InternalBadge';
import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const isMobile = useIsMobile();
  const { availableVersions } = useDocContext();

  return (
    <div className={styles.wrapper}>
      {!isMobile && <GwSearchForm />}
      <InternalBadge />
      <BrowserOnly>{() => <DocHighlighter />}</BrowserOnly>
      {availableVersions && (
        <VersionSelector availableVersions={availableVersions} />
      )}
      <Avatar />
    </div>
  );
}
