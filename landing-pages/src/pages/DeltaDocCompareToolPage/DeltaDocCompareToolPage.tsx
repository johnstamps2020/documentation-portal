import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import { DeltaDocProvider } from 'components/DeltaDocCompareToolPage/DeltaDocContext';
import DeltaDocResults from 'components/DeltaDocCompareToolPage/DeltaDocResultsPanel';
import DeltaDocStatistics from 'components/DeltaDocCompareToolPage/DeltaDocStatistics';
import DeltaDocUpperPanel from 'components/DeltaDocCompareToolPage/DeltaDocUpperPanel';
import { useEffect } from 'react';


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
          <Typography variant="h1" marginBottom="16px">
            Compare documents between releases
          </Typography>
          <Stack direction="row">
            <DeltaDocUpperPanel />
            <DeltaDocStatistics />
          </Stack>
          <Divider sx={{ m: '8px 0 40px 0', width: '100%' }} />
          <DeltaDocResults />
        </Container>
      </Grid>
    </DeltaDocProvider>
  );
}
