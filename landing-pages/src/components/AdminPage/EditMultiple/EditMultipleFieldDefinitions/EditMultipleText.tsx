import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEditMultipleContext } from '../EditMultipleContext';
import { RegexField } from '../editMultipleTypes';

type EditMultipleTextProps = {
  name: string;
};

export default function EditMultipleText({ name }: EditMultipleTextProps) {
  const { handleFieldChange } = useEditMultipleContext();
  const [regex, setRegex] = useState('');
  const [replaceWith, setReplaceWith] = useState('');

  const disableButtons = regex === '' || replaceWith === '';

  function handleApply() {
    handleFieldChange(name, {
      regex: regex,
      replaceWith: replaceWith,
    } as RegexField);
  }

  function handleReset() {
    setRegex('');
    setReplaceWith('');
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        gap: '16px',
        paddingLeft: '16px',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ flex: 1 }}>{name}:</Typography>
      <TextField
        label="regex"
        sx={{ flex: 2 }}
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
      />
      <TextField
        label="replace with"
        sx={{ flex: 2 }}
        value={replaceWith}
        onChange={(e) => setReplaceWith(e.target.value)}
      />
      <IconButton
        aria-label="Apply"
        onClick={handleApply}
        disabled={disableButtons}
        color="primary"
      >
        <PlayArrowIcon />
      </IconButton>
      <IconButton
        aria-label="Reset"
        onClick={handleReset}
        disabled={disableButtons}
        color="error"
      >
        <ClearIcon />
      </IconButton>
    </Stack>
  );
}
