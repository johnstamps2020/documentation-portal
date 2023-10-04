import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PageSettingsDialog from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsDialog';
import PageSettingsForm from 'components/EntitiesAdminPage/PageAdminPage/PageSettingsForm';
import { usePageData } from 'hooks/usePageData';
import { useState } from 'react';
import { Page } from 'server/dist/model/entity/Page';

type DuplicateButtonProps = {
  pagePath: string;
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

export default function DuplicateButton({ pagePath }: DuplicateButtonProps) {
  const { isError, isLoading, pageData } = usePageData(pagePath);

  const [isOpen, setIsOpen] = useState(false);

  function handleCloseDialog() {
    setIsOpen(false);
  }

  function handleOpenDialog() {
    setIsOpen(true);
  }

  if (isError || isLoading || !pageData) {
    return null;
  }

  function getPageDataWithoutUuid(pageData: Page) {
    const { uuid, ...rest } = pageData;
    return rest;
  }

  return (
    <>
      <IconButton
        aria-label="edit"
        title="Duplicate page"
        onClick={handleOpenDialog}
      >
        <ContentCopyIcon color="primary" />
      </IconButton>
      <PageSettingsDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        title="Duplicate page"
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 4,
          }}
        >
          <Stack gap={2}>
            <FormHeading>Source page</FormHeading>
            <PageSettingsForm
              initialPageData={getPageDataWithoutUuid(pageData)}
              disabled
            />
          </Stack>
          <Stack gap={2}>
            <FormHeading>New page</FormHeading>
            <PageSettingsForm
              initialPageData={getPageDataWithoutUuid(pageData)}
            />
          </Stack>
        </Box>
      </PageSettingsDialog>
    </>
  );
}
