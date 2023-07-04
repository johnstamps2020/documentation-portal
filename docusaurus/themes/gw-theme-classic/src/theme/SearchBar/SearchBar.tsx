import React from 'react';
import styles from './SearchBar.module.css';
import Avatar from '@theme/Avatar';
import VersionSelector from '@theme/VersionSelector';
import GwSearchForm from '@theme/GwSearchForm/';
import InternalBadge from '@theme/InternalBadge/InternalBadge';
import BrowserOnly from '@docusaurus/BrowserOnly';
import DocHighlighter from '@theme/DocHighlighter/DocHighlighter';
import useIsMobile from '../../hooks/useIsMobile';

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
