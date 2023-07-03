import React from 'react';
import styles from './Iframe.module.css';

type IframeProps = {
  src: string;
  width?: string;
};

export default function Iframe({ src, width }: IframeProps) {
  return (
    <div style={{ width: width ? width : '100%' }}>
      <div className={styles.iframeWrapper}>
        <iframe
          className={styles.iframe}
          src={src}
          allowFullScreen
          tabIndex={0}
        />
      </div>
    </div>
  );
}
