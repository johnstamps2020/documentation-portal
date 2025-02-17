import Stack from '@mui/material/Stack';
import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from 'components/LandingPage/LandingPageTypes';
import {
  arrangeItems,
  getListOfItemsToDisplayOnLandingPage,
  LandingPageItemData,
} from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

export default function CategorySidebar({ label, items }: SidebarProps) {
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
      <Stack spacing={1}>
        {arrangedLandingPageItems.map((sidebarItem) => (
          <CategoryItem {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
