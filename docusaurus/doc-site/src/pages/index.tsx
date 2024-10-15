import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Button from '@mui/material/Button';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Button
            className="button button--secondary button--lg"
            href="/docs/intro"
            LinkComponent={Link}
            variant="contained"
            color="info"
            endIcon={<RocketLaunchIcon />}
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title={`Docusaurus Guidewire`}
      description="Guidewire themes and plugins for Docusaurus"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
