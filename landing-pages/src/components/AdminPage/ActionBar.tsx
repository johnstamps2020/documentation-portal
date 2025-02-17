import Box from '@mui/material/Box';
import DeleteMultipleButton from './DeleteMultipleButton';
import EditMultipleButton from './EditMultiple/EditMultipleButton';
import SelectAllCheckbox from './SelectAllCheckbox';
import ViewSwitcher from './ViewSwitcher';
import DuplicateMultipleButton from './EditMultiple/DuplicateMultipleButton';

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
      <Box sx={{ display: 'flex', gap: '6px' }}>
        <DuplicateMultipleButton />
        <EditMultipleButton />
        <DeleteMultipleButton />
        <ViewSwitcher />
      </Box>
    </Box>
  );
}
