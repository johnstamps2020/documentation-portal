import Stack from '@mui/material/Stack';
import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from 'pages/LandingPage/LandingPageTypes';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import SidebarSkeleton from '../SidebarSkeleton';
import { arrangeItems } from 'helpers/landingPageHelpers';
import LandingPageItemRenderer from '../LandingPageItemRenderer';

export default function CategorySidebar({ label, items }: SidebarProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);
  const arrangedLandingPageItems = arrangeItems(items, landingPageItems);
  const categorySidebarItem = (
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
      <Typography variant="h2">{label}</Typography>
      <Stack spacing={1}>
        {arrangedLandingPageItems.map((sidebarItem) => (
          <CategoryItem {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );

  return (
    <LandingPageItemRenderer
      item={categorySidebarItem}
      skeleton={<SidebarSkeleton />}
      landingPageItems={arrangedLandingPageItems}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
