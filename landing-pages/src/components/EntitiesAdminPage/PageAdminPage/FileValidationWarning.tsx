import WarningIcon from '@mui/icons-material/Warning';
import { Paper, Typography } from '@mui/material';

type FileValidationWarningProps = {
  path: string;
};

export function checkIfFileExists(path: string) {
  try {
    require(`../../../pages/landing/${path}.tsx`);
    return true;
  } catch (err) {
    return false;
  }
}

export default function FileValidationWarning({
  path,
}: FileValidationWarningProps) {
  try {
    const fileExists = checkIfFileExists(path);
    if (!fileExists) {
      return (
        <>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: '16px',
              p: '6px',
              border: 1,
              borderColor: '#FF7F7F',
            }}
          >
            <WarningIcon color="warning" sx={{ m: 'auto 8px' }} />
            <Typography>
              React component for this page path doesn't exist in landing pages.
            </Typography>
          </Paper>
        </>
      );
    }
    return <></>;
  } catch (err) {
    console.log(err);
    return <></>;
  }
}
