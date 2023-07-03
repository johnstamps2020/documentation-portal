import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './DropdownFrame.module.css';

export default function DropdownFrame({ button, children }) {
  const isBrowser = useIsBrowser();
  const buttonRef = useRef();
  const [visible, setVisible] = useState(false);
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(
    function () {
      function checkIfClickedOutside(e) {
        if (
          isBrowser &&
          visible &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target)
        ) {
          setVisible(false);
        }
      }

      if (isBrowser) {
        document.addEventListener('mousedown', checkIfClickedOutside);
        setButtonHeight(buttonRef.current.clientHeight);
      }

      return function () {
        if (isBrowser) {
          document.removeEventListener('mousedown', checkIfClickedOutside);
        }
      };
    },
    [visible]
  );

  return (
    <div ref={buttonRef} className={styles.wrapper}>
      <div onClick={() => setVisible(!visible)} className={styles.button}>
        {button}
      </div>
      {visible && (
        <div style={{ top: buttonHeight }} className={styles.dropdown}>
          {children}
        </div>
      )}
    </div>
  );
}
