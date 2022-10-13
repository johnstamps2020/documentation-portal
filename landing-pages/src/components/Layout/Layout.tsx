import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
};

export default function Layout({ children, title }: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.center}>
          <SearchBox />
        </div>
        <div className={styles.right}></div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
