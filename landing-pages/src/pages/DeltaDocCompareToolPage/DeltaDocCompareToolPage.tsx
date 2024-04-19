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
    <AccessControl
      pagePath={window.location.href}
      checkAdminAccess={true}
      checkPowerUserAccess={true}
    >
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
              To compare documents, please provide the URLs (including the
              domain) to the root of the corresponding documents you wish to
              compare. Ensure that each URL includes a release.
              <br /> Example: <br />
              If you want to run comparison of{' '}
              <b> ClaimCenter Application Guide</b> in <b>Garmisch</b> and{' '}
              <b>Flaine</b>:
              <br />
              paste{' '}
              <b>
                https://docs.staging.ccs.guidewire.net/cloud/cc/202302/app/
              </b>{' '}
              as first URL (for Garmisch), <br /> paste{' '}
              <b>https://docs.staging.ccs.guidewire.net/cloud/cc/202209/app/</b>{' '}
              as second URL (for Flaine), <br />
              click "See results" and enjoy!
            </Typography>
            <DeltaDocUpperPanel />
            <DeltaDocStatistics />
            <DeltaDocResults />
          </Container>
        </Grid>
      </DeltaDocProvider>
    </AccessControl>
  );
}
