import Box from '@mui/material/Box';
import React from 'react';
import { ChatFilter } from './ChatFilter';
import { filtersFromDb } from './filtersFromDb';

export function ChatFilters() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      {filtersFromDb.map((filter) => (
        <ChatFilter {...filter} key={filter.name} />
      ))}
    </Box>
  );
}
