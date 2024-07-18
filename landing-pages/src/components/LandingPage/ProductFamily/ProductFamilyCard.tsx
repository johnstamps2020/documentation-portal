import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import LandingPageLink from 'components/LandingPage/LandingPageLink';
import {
  arrangeItems,
  getListOfItemsToDisplayOnLandingPage,
  LandingPageItemData,
} from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

export default function ProductFamilyCard(item: LandingPageItemProps) {
  const sx = {
    fontSize: 20,
    fontWeight: 800,
  };
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const itemsToDisplay: LandingPageItemData[] =
    getListOfItemsToDisplayOnLandingPage([item], allAvailableItems);

  const arrangedLandingPageItems = arrangeItems([item], itemsToDisplay);
  return (
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
}
