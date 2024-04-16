import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import InstallationCodeBlock from '../InstallationCodeBlock';
import Stack from '@mui/material/Stack';

type FeatureItem = {
  title: string;
  CodeBlock: React.ReactNode;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Theme',
    CodeBlock: <InstallationCodeBlock packageName="gw-theme-classic" />,
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
    title: 'Redoc plugin',
    CodeBlock: <InstallationCodeBlock packageName="gw-plugin-redoc" />,
    description: (
      <>
        This plugin allows you to generate static pages from your OpenAPI spec.
      </>
    ),
    link: 'docs/Plugins/Redoc/set-up-plugin',
  },
  {
    title: 'Security plugin',
    CodeBlock: <InstallationCodeBlock packageName="docusaurus-security" />,
    description: (
      <>
        This plugin allows you to generate two variants of the site, one public,
        and one restricted.
      </>
    ),
    link: 'docs/Plugins/Security/set-up-plugin-security',
  },
];

function Feature({ title, CodeBlock, description, link }: FeatureItem) {
  return (
    <Stack sx={{ textAlign: 'center' }}>
      <Box sx={{ flex: 1 }}>
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
    </Stack>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <div className="container">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          py: '2rem',
        }}
      >
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </Box>
    </div>
  );
}
