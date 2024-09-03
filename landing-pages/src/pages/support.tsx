import { createFileRoute } from '@tanstack/react-router';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ServerMessagePage from 'components/ServerMessagePage';
import { useLayoutContext } from 'LayoutContext';
import { useEffect } from 'react';

export const Route = createFileRoute('/support')({
  component: SupportPage,
});

function SupportPage() {
  const { setTitle } = useLayoutContext();
  useEffect(() => {
    setTitle('Support');
  }, [setTitle]);

  const informationToDisplay = (
    <Stack spacing={6}>
      <Typography variant="h1" sx={{ color: 'black' }}>
        Legal and support information
      </Typography>
      <Stack spacing={2}>
        <Typography variant="h2" sx={{ color: 'black' }}>
          Legal
        </Typography>
        <Typography>
          Some offerings may require additional licensing. To determine whether
          your license agreement includes a specific offering, contact your
          Guidewire sales representative. Offerings may vary depending on
          geographic location. To determine whether a specific offering is
          available in your geographic location, contact your Guidewire sales
          representative.
        </Typography>
        <Link href="https://www.guidewire.com/legal-notices" target="_blank">
          Legal notices
        </Link>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h2" sx={{ color: 'black' }}>
          Support
        </Typography>
        <Typography>For assistance, visit the Guidewire Community.</Typography>
        <Link href="https://community.guidewire.com" target="_blank">
          Guidewire customers
        </Link>
        <Link href="https://partner.guidewire.com" target="_blank">
          Guidewire partners
        </Link>
      </Stack>
    </Stack>
  );
  return (
    <ServerMessagePage
      title="Support"
      informationToDisplay={informationToDisplay}
    />
  );
}
