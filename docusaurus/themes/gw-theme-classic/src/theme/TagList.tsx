import React from 'react';
import Chip from '@mui/material/Chip';

type TagListProps = {
  tags: string[];
};

export default function TagList({ tags }: TagListProps): JSX.Element {
  return (
    <>
      {tags.map((tag, index) => (
        <Chip label={tag} key={index} sx={{ fontSize: '12px' }} />
      ))}
    </>
  );
}
