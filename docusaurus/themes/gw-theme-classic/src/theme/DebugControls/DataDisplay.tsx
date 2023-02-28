import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type DataDisplayProps = {
  data: any;
};

export default function DataDisplay({ data }: DataDisplayProps) {
  if (Array.isArray(data)) {
    return (
      <Stack
        spacing={1}
        flexWrap="wrap"
        flexDirection="row"
        alignItems="center"
      >
        {data.map((item, idx) => (
          <Chip key={idx} label={item} />
        ))}
      </Stack>
    );
  }

  return <Chip label={JSON.stringify(data)} />;
}
