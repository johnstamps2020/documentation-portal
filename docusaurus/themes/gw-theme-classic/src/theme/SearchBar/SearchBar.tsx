import BrowserOnly from '@docusaurus/BrowserOnly';
import Avatar from '@theme/Avatar';
import DocHighlighter from '@theme/DocHighlighter/DocHighlighter';
import GwSearchForm from '@theme/GwSearchForm/';
import InternalBadge from '@theme/InternalBadge/InternalBadge';
import VersionSelector from '@theme/VersionSelector';
import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const isMobile = useIsMobile();

  return (
    <div className={styles.wrapper}>
      {!isMobile && <GwSearchForm />}
      <InternalBadge />
      <BrowserOnly>{() => <DocHighlighter />}</BrowserOnly>
      <VersionSelector />
      <Avatar />
    </div>
  );
}
