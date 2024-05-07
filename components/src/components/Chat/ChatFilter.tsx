import { FilterName } from '@doctools/server';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useChat } from './ChatContext';

export type FilterConfig = {
  label: string;
  name: FilterName;
  values: string[];
};

export function ChatFilter({ label, name, values }: FilterConfig) {
  const { updateFilters, getFilterValues } = useChat();
  const value = getFilterValues(name);

  function handleChange(event: any, newValue: string[]): void {
    updateFilters(name, newValue);
  }

  return (
    <Autocomplete
      multiple
      id="filter-combo-box"
      options={values}
      renderInput={(params) => <TextField {...params} label={label} />}
      fullWidth
      value={value}
      onChange={handleChange}
    />
  );
}
