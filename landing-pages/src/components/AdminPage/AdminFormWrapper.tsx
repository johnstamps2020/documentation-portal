import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack, { StackProps } from '@mui/material/Stack';

type AdminFormWrapperProps = {
  children: JSX.Element[] | JSX.Element;
  disabled: boolean;
  dataChanged: boolean;
  canSubmitData: boolean;
  handleSave: () => void;
  handleResetForm: () => void;
  sx?: StackProps['sx'];
};

export default function AdminFormWrapper({
  children,
  disabled,
  dataChanged,
  canSubmitData,
  handleSave,
  handleResetForm,
  sx,
}: AdminFormWrapperProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        backgroundColor: 'white',
        py: 4,
        ...sx,
      }}
    >
      {children}
      <Stack direction="row" spacing={1}>
        <ButtonGroup disabled={disabled || !dataChanged}>
          <Button
            disabled={!canSubmitData}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleResetForm}>
            Reset
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
