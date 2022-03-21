import React from 'react';
import styles from './Home.module.css';

export default function Home() {
  const topNavItems = [...document.querySelectorAll('nav > ul > li')].map(i =>
    i.querySelector('a')
  );

  const title = document.title;

  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <div className={styles.nav}>
          {topNavItems.map((link, key) => (
            <a href={link.href} key={key} className={styles.tile}>
              {link.innerText}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
