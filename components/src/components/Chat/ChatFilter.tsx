import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useChat } from './ChatContext';

export type FilterConfig = {
  label: string;
  name: string;
  values: string[];
};

export function ChatFilter({ label, name, values }: FilterConfig) {
  const { updateFilters, filters } = useChat();
  const [value, setValue] = useState();
  return (
    <Autocomplete
      multiple
      id="filter-combo-box"
      options={values}
      renderInput={(params) => <TextField {...params} label={label} />}
      fullWidth
    />
  );
}
