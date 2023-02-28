import Translate from '@theme/Translate';
import React from 'react';
import styles from './Internal.module.css';

export default function Prompt() {
  return (
    <div className={styles.prompt}>
      <Translate id="internal.label">
        This content is internal and available to Guidewire employees only.
      </Translate>
    </div>
  );
}
