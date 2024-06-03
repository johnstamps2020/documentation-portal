import { GwEntity } from '@doctools/components';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';

type CommonProps = Omit<GwEntity, 'uuid'>;

type AdminBooleanTogglesProps = {
  editingDisabled: boolean;
  entityProps: CommonProps;
  handleChange: (field: string, value: string | boolean) => void;
};

export default function AdminBooleanToggles({
  editingDisabled,
  entityProps,
  handleChange,
}: AdminBooleanTogglesProps) {
  const commonPropKeys: (keyof typeof entityProps)[] = [
    'internal',
    'public',
    'earlyAccess',
    'isInProduction',
  ];
  return (
    <FormGroup>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {commonPropKeys.map((key) => (
          <FormControlLabel
            disabled={editingDisabled}
            key={key}
            control={
              <Switch
                value={key}
                checked={entityProps[key] as boolean}
                onChange={(event) => handleChange(key, event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={key}
          />
        ))}
      </Box>
    </FormGroup>
  );
}
