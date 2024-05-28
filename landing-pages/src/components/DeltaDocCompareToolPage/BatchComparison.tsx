import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';

export default function BatchComparison() {
  const { batchComparison, setBatchComparison } = useDeltaDocContext();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  return (
    <Container>
      <Stack alignItems="center" maxWidth="650px" margin="24px auto">
        <FormControlLabel
          control={<Switch defaultChecked={false} />}
          label={
            <Typography variant="h2" padding={0}>
              Batch comparison
            </Typography>
          }
          onChange={() => {
            setBatchComparison(!batchComparison);
          }}
        />
        <Button onClick={() => setShowMoreInfo(!showMoreInfo)}>
          More info on batch comparison
        </Button>
        <Collapse in={showMoreInfo}>
          <Typography textAlign="center">
            Selecting batch comparison enables running comparison on whole
            product within releases. <br />
            To compare <b>ClaimCenter</b> between <b>Jasper</b> and{' '}
            <b>Innsbruck</b>, select <b>ClaimCenter</b>, <b>Jasper</b> and{' '}
            <b>Innsbruck</b> from selectors and download a report when it's
            ready. <br />
            Warning! Running comparison on products with big number of documents
            can take more time.
          </Typography>
        </Collapse>
      </Stack>
    </Container>
  );
}
