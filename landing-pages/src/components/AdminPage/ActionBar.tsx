import Box from '@mui/material/Box';
import DeleteMultipleButton from './DeleteMultipleButton';
import SelectAllCheckbox from './SelectAllCheckbox';
import ViewSwitcher from './ViewSwitcher';

export default function ActionBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <SelectAllCheckbox />
      <Box>
        <DeleteMultipleButton />
        <ViewSwitcher />
      </Box>
    </Box>
  );
}
