import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { SidebarProps } from 'pages/LandingPage/LandingPageTypes';
import SidebarSkeleton from '../SidebarSkeleton';
import Category2Item from './Category2Item';

export default function Category2Sidebar({ label, items }: SidebarProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);

  if (
    isError ||
    (landingPageItems && landingPageItems.length === 0) ||
    !landingPageItems
  ) {
    return null;
  }

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <Paper
      sx={{
        height: 'fit-content',
        minHeight: '180px',
        minWidth: '270px',
        width: {
          sm: 'fit-content',
          xs: '100%',
        },
        padding: '24px',
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
        {label}
      </Typography>
      <Divider />
      <Stack gap={2} py={2}>
        {landingPageItems.map((sidebarItem) => (
          <Category2Item {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
