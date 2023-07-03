import React from 'react';
import Card from '@mui/material/Card';
import CloseIcon from '@mui/icons-material/Close';
import { ContainedButton, TextButton } from '../Button/Button';
import styles from './Modal.module.css';

type ModalProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
  saveButtonLabel: string;
  cancelButtonLabel: string;
};

export default function Modal({
  title,
  children,
  saveButtonLabel,
  cancelButtonLabel,
}: ModalProps) {
  return (
    <Card className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>{children}</div>
      </div>
      <div className={styles.actionBar}>
        <TextButton>{cancelButtonLabel}</TextButton>
        <ContainedButton>{saveButtonLabel}</ContainedButton>
      </div>
      <CloseIcon sx={{ position: 'absolute', top: '1rem', right: '1rem' }} />
    </Card>
  );
}
