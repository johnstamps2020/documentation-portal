import Box from '@mui/material/Box';
import React from 'react';
import { useChat } from './ChatContext';
import { ChatFilter } from './ChatFilter';
import { filtersFromDb } from './filtersFromDb';

export function ChatFilters() {
  const { updateFilters, filters } = useChat();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      {filtersFromDb.map((filter) => (
        <ChatFilter {...filter} />
      ))}
    </Box>
  );
}
