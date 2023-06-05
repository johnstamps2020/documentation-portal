import clsx from 'clsx';
import React from 'react';
import styles from './Explore.module.css';

type HeadingButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function HeadingButton({
  children,
  onClick,
}: HeadingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.backButton, 'button button--link')}
    >
      {children}
    </button>
  );
}
