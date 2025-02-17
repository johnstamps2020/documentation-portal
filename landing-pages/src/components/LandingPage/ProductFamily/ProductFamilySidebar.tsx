import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from 'components/LandingPage/LandingPageTypes';
import FamilyProductItem from './ProductFamilyItem';
import {
  arrangeItems,
  getListOfItemsToDisplayOnLandingPage,
  LandingPageItemData,
} from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

export default function ProductFamilySidebar({ label, items }: SidebarProps) {
  const { allAvailableItems } = useLandingPageItemsContext();
  if (!allAvailableItems) {
    return null;
  }

  const itemsToDisplay: LandingPageItemData[] =
    getListOfItemsToDisplayOnLandingPage(items, allAvailableItems);

  if (itemsToDisplay.length === 0) {
    return null;
  }

  const arrangedLandingPageItems = arrangeItems(items, itemsToDisplay);

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
        {arrangedLandingPageItems.map((sidebarItem) => (
          <FamilyProductItem key={sidebarItem.label} {...sidebarItem} />
        ))}
      </>
    </Paper>
  );
}
