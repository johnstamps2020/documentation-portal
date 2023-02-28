import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className={clsx('footer', 'footer--dark', styles.wrapper)}>
      <Link
        href="https://docs.guidewire.com/support"
        className={styles.copyrightLink}
      >
        Legal and Support Information
      </Link>
      <div>Copyright © 2001-{year} Guidewire Software, Inc.</div>
    </div>
  );
}
