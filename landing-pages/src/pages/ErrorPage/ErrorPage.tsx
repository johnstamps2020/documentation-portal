import Layout from "../../components/Layout/Layout";
import styles from "./ErrorPage.module.css";
import Paper from "@mui/material/Paper";

type ErrorPageProps = {
  code: number;
  message: JSX.Element;
};

export default function ErrorPage({ code, message }: ErrorPageProps) {
  return (
    <Layout title="Error">
      <Paper elevation={3} className={styles.wrapper}>
        <h1>Oh no! It looks like there was a problem!</h1>
        <div className={styles.code}>{code}</div>
        <div className={styles.message}>{message}</div>
      </Paper>
    </Layout>
  );
}
