import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';

export default function BatchComparison() {
  const { batchComparison, setBatchComparison } = useDeltaDocContext();
  return (
    <Box>
      <FormControlLabel
        control={<Switch defaultChecked={false} />}
        label={
          <Typography variant="h2" padding={0}>
            Compare all documents
          </Typography>
        }
        onChange={() => {
          setBatchComparison(!batchComparison);
        }}
      />
    </Box>
  );
}
