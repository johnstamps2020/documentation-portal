import Card from '@mui/material/Card';
import React from 'react';
import styles from './Success.module.css';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function Success({ children }) {
  return (
    <Card className={styles.wrapper}>
      <div className={styles.iconBox}>
        <div className={styles.iconCircle}>
          <DoneIcon sx={{ color: 'green' }} />
        </div>
      </div>
      <strong className={styles.label}>Success:</strong>
      <div>{children}</div>
      <CloseIcon
        sx={{ marginLeft: 'auto', marginRight: '0.5rem' }}
        aria-label="Close"
      />
    </Card>
  );
}
