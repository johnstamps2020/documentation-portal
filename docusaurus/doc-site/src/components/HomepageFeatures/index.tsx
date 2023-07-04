import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import InstallationCodeBlock from '../InstallationCodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

type FeatureItem = {
  title: string;
  CodeBlock: React.ReactNode;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Theme',
    CodeBlock: <InstallationCodeBlock />,
    description: (
      <>
        Ready for docs.guidewire.com! This is the official Guidewire theme for
        docs with the beautiful header and footer, search box, user avatar, and
        more.
      </>
    ),
    link: 'docs/Themes/Classic/set-up-theme',
  },
  {
    title: 'Plugin',
    CodeBlock: <InstallationCodeBlock forPlugin />,
    description: (
      <>
        This plugin allows you to generate static pages from your OpenAPI spec.
      </>
    ),
    link: 'docs/Plugins/Redoc/set-up-plugin',
  },
];

function Feature({ title, CodeBlock, description, link }: FeatureItem) {
  return (
    <Grid xs={12} sm={6}>
      <div className={styles.feature}>
        <Box>
          <h2>{title}</h2>
          <div className="text--center">{CodeBlock}</div>
          <p>{description}</p>
        </Box>
        <Box>
          <Button
            className="button button--primary button--lg"
            href={useBaseUrl(link)}
            LinkComponent={Link}
            variant="contained"
          >
            Details
          </Button>
        </Box>
      </div>
    </Grid>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <div className="container">
      <Grid container>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </Grid>
    </div>
  );
}
