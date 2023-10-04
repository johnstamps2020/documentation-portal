import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useExternalLinkData } from 'hooks/useExternalLinkData';
import { useState } from 'react';
import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import ExternalLinkSettingsDialog from '../../ExternalLinkSettingsDialog';
import ExternalLinkSettingsForm from '../../ExternalLinkSettingsForm';

type DuplicateButtonProps = {
  externalLinkUrl: string;
};

function FormHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        fontWeight: 'bold',
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

export default function DuplicateButton({ externalLinkUrl }: DuplicateButtonProps) {
  const { isError, isLoading, externalLinkData } = useExternalLinkData(externalLinkUrl);

  const [isOpen, setIsOpen] = useState(false);

  function handleCloseDialog() {
    setIsOpen(false);
  }

  function handleOpenDialog() {
    setIsOpen(true);
  }

  if (isError || isLoading || !externalLinkData) {
    return null;
  }

  function getExternalLinkDataWithoutUuid(externalLinkData: ExternalLink) {
    const { uuid, ...rest } = externalLinkData;
    return rest;
  }

  return (
    <>
      <IconButton
        aria-label="edit"
        title="Duplicate external link"
        onClick={handleOpenDialog}
      >
        <ContentCopyIcon color="primary" />
      </IconButton>
      <ExternalLinkSettingsDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        label="Duplicate external link"
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 4,
          }}
        >
          <Stack gap={2}>
            <FormHeading>Source external link</FormHeading>
            <ExternalLinkSettingsForm
              initialExternalLinkData={getExternalLinkDataWithoutUuid(externalLinkData)}
              disabled
            />
          </Stack>
          <Stack gap={2}>
            <FormHeading>New external link</FormHeading>
            <ExternalLinkSettingsForm
              initialExternalLinkData={getExternalLinkDataWithoutUuid(externalLinkData)}
            />
          </Stack>
        </Box>
      </ExternalLinkSettingsDialog>
    </>
  );
}
