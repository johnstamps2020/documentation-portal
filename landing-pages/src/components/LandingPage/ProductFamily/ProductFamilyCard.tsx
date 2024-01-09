import Paper from '@mui/material/Paper';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import LandingPageLink from 'components/LandingPage/LandingPageLink';
import Skeleton from '@mui/material/Skeleton';
import LandingPageItemRenderer from '../LandingPageItemRenderer';
import { arrangeItems } from 'helpers/landingPageHelpers';

export default function ProductFamilyCard(item: LandingPageItemProps) {
  const sx = {
    fontSize: 20,
    fontWeight: 800,
  };
  const { landingPageItems, isLoading, isError } = useLandingPageItems([item]);
  const arrangedLandingPageItems = arrangeItems([item], landingPageItems);
  const productFamilyItem = (
    <Paper
      sx={{
        height: '100px',
        width: { xs: '100%', sm: '300px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {arrangedLandingPageItems && (
        <LandingPageLink
          landingPageItem={arrangedLandingPageItems[0]}
          sx={sx}
        />
      )}
    </Paper>
  );
  const productFamilySkeleton = (
    <Skeleton
      variant="rectangular"
      sx={{
        width: { sm: '300px', xs: '100%' },
        height: '100px',
      }}
    />
  );
  return (
    <LandingPageItemRenderer
      landingPageItems={arrangedLandingPageItems}
      isLoading={isLoading}
      isError={isError}
      skeleton={productFamilySkeleton}
      item={productFamilyItem}
    />
  );
}
