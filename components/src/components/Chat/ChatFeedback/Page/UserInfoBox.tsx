import Box from '@mui/material/Box';
import React from 'react';
import { ChatbotComment } from '../../../../types';
import Typography from '@mui/material/Typography';

type UserInfoBoxProps = ChatbotComment['user'];

export function UserInfoBox({ reaction, comment, email }: UserInfoBoxProps) {
  return (
    <Box sx={{ pt: 2 }}>
      <Typography variant="h3">User information</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography>
          <strong>User email:</strong> {email}
        </Typography>
        <Typography>
          <strong>Their reaction:</strong> {reaction}
        </Typography>
      </Box>
      <Typography variant="h3">Detailed comment</Typography>
      <Typography>{comment || '<No comment added by user>'}</Typography>
    </Box>
  );
}
