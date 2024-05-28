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
      <Stack alignItems="center" maxWidth="500px" margin="24px auto">
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
          <Typography textAlign="justify">
            The batch option compares all documents for a product between
            releases. For example, to compare all <b>ClaimCenter</b> documents
            between <b>Jasper</b> and <b>Innsbruck</b>, use these settings and
            click <b>Compare</b>: <br />
            <li>Product: ClaimCenter</li>
            <li>First release: Jasper</li>
            <li>Second release: Innsbruck</li> <br />
            You can download the report when it's ready. <br />
            <b>Important!</b> Running batch comparison on a product with a large
            number of documents can take a long time.
          </Typography>
        </Collapse>
      </Stack>
    </Container>
  );
}
