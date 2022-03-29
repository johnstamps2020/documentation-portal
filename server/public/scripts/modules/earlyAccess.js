import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../../stylesheets/modules/earlyAccess.module.css';

function EarlyAccessWarning() {
  return (
    <>
      <div className={styles.earlyAccessWarning}>
        Early Access document. Do not share this content.
      </div>
    </>
  );
}

export function addEarlyAccessMark() {
  const isEarlyAccess =
    window.location.pathname.includes('gw-feature-preview') ||
    window.docTitle.toLowerCase().includes('early access') ||
    window.docProduct.toLowerCase().includes('feature preview');
  if (isEarlyAccess) {
    const warningContainer = document.createElement('div');
    const main = document.querySelector('main');
    main.prepend(warningContainer);
    React.createElement('div');
    ReactDOM.render(<EarlyAccessWarning />, warningContainer);
  }
}
