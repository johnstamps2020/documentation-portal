import Box from '@mui/material/Box';
import DeleteMultipleButton from './DeleteMultipleButton';
import ViewSwitcher from './ViewSwitcher';
import { useAdminViewContext } from './AdminViewContext';
import { useEffect } from 'react';

type ActionBarProps = {
  entityDatabaseName: string;
  entityPrimaryKeyName: string;
};

export default function ActionBar({
  entityDatabaseName,
  entityPrimaryKeyName,
}: ActionBarProps) {
  const { setEntityDatabaseName, setEntityPrimaryKeyName } =
    useAdminViewContext();

  useEffect(() => {
    setEntityDatabaseName(entityDatabaseName);
    setEntityPrimaryKeyName(entityPrimaryKeyName);

    return () => {
      setEntityDatabaseName('');
      setEntityPrimaryKeyName('');
    };
  }, [
    entityDatabaseName,
    entityPrimaryKeyName,
    setEntityPrimaryKeyName,
    setEntityDatabaseName,
  ]);
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
