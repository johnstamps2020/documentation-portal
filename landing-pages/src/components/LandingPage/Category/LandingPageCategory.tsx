import Stack from '@mui/material/Stack';
import LandingPageItem from '../LandingPageItem';
import LandingPageSubCategory from './LandingPageSubCategory';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function LandingPageCategory() {
  return (
    <Paper
      sx={{
        width: {
          sm: '300px',
          xs: '100%',
        },
        padding: '24px',
      }}
    >
      <Typography variant="h2">Dummy label</Typography>
      <Stack spacing={1}></Stack>
    </Paper>
  );
}
