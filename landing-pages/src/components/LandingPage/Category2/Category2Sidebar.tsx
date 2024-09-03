import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  arrangeItems,
  getListOfItemsToDisplayOnLandingPage,
} from 'helpers/landingPageHelpers';
import { LandingPageItemData } from 'helpers/landingPageHelpers';
import { SidebarProps } from 'components/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import Category2Item from './Category2Item';

export default function Category2Sidebar({ label, items }: SidebarProps) {
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
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
        {label}
      </Typography>
      <Divider />
      <Stack gap={2} py={2}>
        {arrangedLandingPageItems.map((sidebarItem) => (
          <Category2Item {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
