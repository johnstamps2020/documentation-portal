import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Source } from '@doctools/server';

type SourceTextFieldsProps = {
  source: Source;
};

export default function SourceTextFields({ source }: SourceTextFieldsProps) {
  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: 'center',
        py: 2,
        minWidth: '300px',
      }}
    >
      <TextField disabled label="Source id" value={source.id} fullWidth />
      <TextField disabled label="Source name" value={source.name} fullWidth />
      <TextField
        disabled
        label="Source gitUrl"
        value={source.gitUrl}
        fullWidth
      />
      <TextField
        disabled
        label="Source gitBranch"
        value={source.gitBranch}
        fullWidth
      />
    </Stack>
  );
}
