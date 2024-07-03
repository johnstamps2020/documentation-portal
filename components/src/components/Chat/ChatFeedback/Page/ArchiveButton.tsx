import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { ChatbotComment } from '../../../../types';
import { postComment } from '../api';
import Alert from '@mui/material/Alert';

type ArchiveButtonProps = {
  item: ChatbotComment;
};

export function ArchiveButton({ item }: ArchiveButtonProps) {
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleArchiveStatus(value: ChatbotComment['status']) {
    setProcessing(true);
    setError('');
    const updatedComment: ChatbotComment = {
      ...item,
      status: value,
    };

    const problem = await postComment(updatedComment);

    if (problem) {
      setError(problem);
    }

    setProcessing(false);
  }

  if (item.status === 'archived') {
    return (
      <Button
        startIcon={<UnarchiveIcon />}
        onClick={() => {
          handleArchiveStatus('active');
        }}
        disabled={processing}
      >
        Unarchive
      </Button>
    );
  }
  return (
    <>
      <Button
        startIcon={<ArchiveIcon />}
        variant="contained"
        onClick={() => {
          handleArchiveStatus('archived');
        }}
        disabled={processing}
      >
        Archive this comment
      </Button>
      {error.length > 0 && <Alert severity="error">{error}</Alert>}
    </>
  );
}
