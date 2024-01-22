import Button from '@mui/material/Button';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { useState } from 'react';
import AdminDialog from './AdminDialog';
import { useAdminViewContext } from './AdminViewContext';
import EditMultipleWrapper from './EditMultiple/EditMultipleWrapper';

export type MultipleOperationMode = 'Edit' | 'Duplicate';

type MultipleButtonProps = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  mode: MultipleOperationMode;
};

export default function MultipleButton({ Icon, mode }: MultipleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEntities } = useAdminViewContext();

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
      ? `${mode} item`
      : `${mode} ${selectedEntities.length} items`;

  return (
    <>
      <Button
        variant="contained"
        color={mode === 'Edit' ? 'primary' : 'secondary'}
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
        <EditMultipleWrapper mode={mode} />
      </AdminDialog>
    </>
  );
}
