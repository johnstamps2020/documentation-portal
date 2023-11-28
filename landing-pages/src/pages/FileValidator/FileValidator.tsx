import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLayoutContext } from 'LayoutContext';
import AdminAccess from 'components/AdminPage/AdminAccess';
import { useEffect } from 'react';
import FileValidatorPanel from 'components/FileValidator/FileValidatorPanel';

export default function FileValidator() {
  const { title, setTitle, setHeaderOptions } = useLayoutContext();
  useEffect(() => {
    setTitle('Validate files');
  }, [setHeaderOptions, setTitle]);

  return (
    <AdminAccess pagePath={window.location.pathname}>
      <Container>
        <Stack spacing={2} sx={{mt: "32px"}}>
          <Typography variant="h1" sx={{ color: 'black' }}>
            {title}
          </Typography>
          <FileValidatorPanel />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
