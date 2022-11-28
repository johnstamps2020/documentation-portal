import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

export default function Layout({
  children,
  title,
  searchFilters,
  hideSearchBox
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.center}>
          {!hideSearchBox && <SearchBox {...searchFilters} />}
        </div>
        <div className={styles.right} />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer} />
    </div>
  );
}
