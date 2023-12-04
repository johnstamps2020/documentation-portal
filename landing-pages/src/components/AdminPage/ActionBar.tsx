import Box from '@mui/material/Box';
import DeleteMultipleButton from './DeleteMultipleButton';
import ViewSwitcher from './ViewSwitcher';

export default function ActionBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <DeleteMultipleButton />
      <ViewSwitcher />
    </Box>
  );
}
