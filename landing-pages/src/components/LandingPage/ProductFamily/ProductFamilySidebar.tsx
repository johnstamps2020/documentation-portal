import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from 'pages/LandingPage/LandingPageTypes';
import FamilyProductItem from './ProductFamilyItem';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import SidebarSkeleton from '../SidebarSkeleton';

export default function ProductFamilySidebar({ label, items }: SidebarProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);

  if (isError || (landingPageItems && landingPageItems.length === 0)) {
    return null;
  }

  if (isLoading || !landingPageItems) {
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
      <Typography variant="h2">{label}</Typography>
      <>
        {landingPageItems.map((sidebarItem) => (
          <FamilyProductItem key={sidebarItem.label} {...sidebarItem} />
        ))}
      </>
    </Paper>
  );
}
