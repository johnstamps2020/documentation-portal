import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from 'pages/LandingPage/LandingPageTypes';
import FamilyProductItem from './ProductFamilyItem';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import SidebarSkeleton from '../SidebarSkeleton';
import { arrangeItems } from 'helpers/landingPageHelpers';
import LandingPageItemRenderer from '../LandingPageItemRenderer';

export default function ProductFamilySidebar({ label, items }: SidebarProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);
  const arrangedLandingPageItems = arrangeItems(items, landingPageItems);
  const productFamilySidebarItem = (
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
      <>
        {arrangedLandingPageItems.map((sidebarItem) => (
          <FamilyProductItem key={sidebarItem.label} {...sidebarItem} />
        ))}
      </>
    </Paper>
  );

  return (
    <LandingPageItemRenderer
      item={productFamilySidebarItem}
      skeleton={<SidebarSkeleton />}
      landingPageItems={arrangedLandingPageItems}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
