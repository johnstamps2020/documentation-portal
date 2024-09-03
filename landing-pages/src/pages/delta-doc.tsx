import { createFileRoute } from '@tanstack/react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AccessControl from 'components/AccessControl/AccessControl';
import { DeltaDocProvider } from 'components/DeltaDocCompareToolPage/DeltaDocContext';
import DeltaDocResults from 'components/DeltaDocCompareToolPage/DeltaDocResultsPanel';
import DeltaDocStatistics from 'components/DeltaDocCompareToolPage/DeltaDocStatistics';
import DeltaDocUpperPanel from 'components/DeltaDocCompareToolPage/DeltaDocUpperPanel';
import { useEffect, useState } from 'react';
import BatchComparison from 'components/DeltaDocCompareToolPage/BatchComparison';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

export const fileDoesNotExistText = 'N/A - file does not exist';

export const statistics = [
  { text: `Files scanned: `, value: 0 },
  { text: `Identical entries: `, value: 0 },
  {
    text: `ReleaseA file count: `,
    value: 0,
  },
  {
    text: `ReleaseB file count: `,
    value: 0,
  },
  {
    text: `Percentage of files in the doc base that were edited: `,
    value: '',
  },
  {
    text: `Percentage that the doc base changed by between the two releases: `,
    value: '',
  },
];

export const Route = createFileRoute('/delta-doc')({
  component: DeltaDocCompareToolPage,
});

function DeltaDocCompareToolPage() {
  const { setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Delta Doc Comparison Tool');
  }, [setTitle]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <AccessControl accessLevel="power-user">
      <DeltaDocProvider>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: '800px',
            width: '800px',
            gap: 2,
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              margin: 'auto',
              marginTop: 4,
            }}
            spacing={1.5}
          >
            <Typography variant="h1">Doc Delta Tool</Typography>
            <Typography variant="body1">
              Check what has changed in documents between releases. You can
              compare a single document or all documents for a product.
            </Typography>
            <Button onClick={() => setShowMoreInfo(!showMoreInfo)}>
              Read more
            </Button>
            <Collapse in={showMoreInfo}>
              <Typography textAlign="left" component="div">
                <p>
                  To compare a single document, select a product, a document and
                  releases.
                </p>
                <p>
                  For example, to compare
                  <b>BillingCenter Administration Guide</b> for Cloud between
                  <b>Garmisch</b> and <b>Jasper</b>, use these settings and
                  select <b>Compare</b>:
                </p>
                <ul>
                  <li>Product: BillingCenter</li>
                  <li>
                    Document: Administration (cloud/bc/&lt;release&gt;/admin)
                  </li>
                  <li>First release: Garmisch</li>
                  <li>Second release: Jasper</li>
                </ul>
                <p>
                  To compare all documents for a product, enable the{' '}
                  <b>Compare all documents</b> option and then select a product
                  and releases.
                </p>
                <p>
                  For example, to compare all <b>ClaimCenter</b> documents
                  between <b>Jasper</b> and <b>Innsbruck</b>, use these settings
                  and click <b>Compare</b>:
                </p>
                <ul>
                  <li>Product: ClaimCenter</li>
                  <li>First release: Jasper</li>
                  <li>Second release: Innsbruck</li>
                </ul>
                <p>
                  When the comparison results are ready, you can download them
                  as a TXT report.
                </p>
                <p>
                  <b>Important!</b> Running batch comparison on a product with a
                  large number of documents can take a long time.
                </p>
              </Typography>
            </Collapse>
          </Stack>
          <BatchComparison />
        </Container>
        <Container>
          <DeltaDocUpperPanel />
          <DeltaDocStatistics />
          <DeltaDocResults />
        </Container>
      </DeltaDocProvider>
    </AccessControl>
  );
}
