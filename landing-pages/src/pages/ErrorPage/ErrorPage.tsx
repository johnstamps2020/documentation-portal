import styles from './ErrorPage.module.css';
import Paper from '@mui/material/Paper';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

type ErrorPageProps = {
  code: number;
  message: JSX.Element;
};

export default function ErrorPage({ code, message }: ErrorPageProps) {
  const { setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Error');
  }, [setTitle]);

  return (
    <Paper elevation={3} className={styles.wrapper}>
      <h1>Oh no! It looks like there was a problem!</h1>
      <div className={styles.code}>{code}</div>
      <div className={styles.message}>{message}</div>
    </Paper>
  );
}
