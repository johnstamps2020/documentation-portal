import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AccessControl from 'components/AccessControl/AccessControl';
import { DeltaDocProvider } from 'components/DeltaDocCompareToolPage/DeltaDocContext';
import DeltaDocResults from 'components/DeltaDocCompareToolPage/DeltaDocResultsPanel';
import DeltaDocStatistics from 'components/DeltaDocCompareToolPage/DeltaDocStatistics';
import DeltaDocUpperPanel from 'components/DeltaDocCompareToolPage/DeltaDocUpperPanel';
import { useEffect } from 'react';
import BatchComparing from 'components/DeltaDocCompareToolPage/BatchComparison';

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

export default function DeltaDocCompareToolPage() {
  const { setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Delta Doc Comparison Tool');
  }, [setTitle]);

  return (
    <AccessControl accessLevel="power-user">
      <DeltaDocProvider>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'fit-content',
          }}
        >
          <Container
            sx={{
              padding: '3rem 0',
            }}
          >
            <Typography variant="h1" marginBottom="16px" textAlign="center">
              Compare documents between releases
            </Typography>
            <Typography
              variant="body1"
              marginBottom="16px"
              width="650px"
              margin="auto"
              textAlign="justify"
            >
              Select a product associated with the document you need to compare.
              Then select a document and both releases. Selecting a product is
              optional but advised. If you are not sure to which product your
              document belongs, you can expand Document list and select from all
              documents (be advised that the performance time might be worse).
              You can also run batch comparison for whole products by switching
              to "Batch comparison" mode.
            </Typography>
            <BatchComparing />
            <DeltaDocUpperPanel />
            <DeltaDocStatistics />
            <DeltaDocResults />
          </Container>
        </Grid>
      </DeltaDocProvider>
    </AccessControl>
  );
}
