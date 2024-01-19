import Button from '@mui/material/Button';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { useEffect, useState } from 'react';
import AdminDialog from './AdminDialog';
import { useAdminViewContext } from './AdminViewContext';
import EditMultipleWrapper from './EditMultiple/EditMultipleWrapper';

export type MultipleOperationName = 'Edit' | 'Duplicate';

type MultipleButtonProps = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  operationName: MultipleOperationName;
};

export default function MultipleButton({
  Icon,
  operationName,
}: MultipleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEntities, entityDatabaseName, setOperationName } =
    useAdminViewContext();

  useEffect(() => {
    setOperationName(operationName);

    return () => {
      setOperationName(null);
    };
  }, [operationName, setOperationName]);

  if (selectedEntities.length === 0) {
    return null;
  }

  function handleOpenEditor() {
    setIsOpen(true);
  }

  function handleCloseEditor() {
    setIsOpen(false);
  }

  const label =
    selectedEntities.length === 1
      ? `${operationName} item`
      : `${operationName} items`;

  return (
    <>
      <Button
        variant="contained"
        color={operationName === 'Edit' ? 'primary' : 'secondary'}
        onClick={handleOpenEditor}
        startIcon={<Icon />}
      >
        {label}
      </Button>
      <AdminDialog
        label={label}
        onClose={handleCloseEditor}
        isOpen={isOpen}
        showInFullScreen
      >
        <EditMultipleWrapper />
      </AdminDialog>
    </>
  );
}
