import Typography from '@mui/material/Typography';
import React from 'react';

type DateDisplayProps = {
  milliseconds: number;
};

export function DateDisplay({ milliseconds }: DateDisplayProps) {
  const date = new Date(milliseconds);
  const formattedDate = Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date);
  return <Typography>{formattedDate}</Typography>;
}
