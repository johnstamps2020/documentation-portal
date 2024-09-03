import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
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

  const cardItemsToDisplay: LandingPageItemData[] =
    getListOfItemsToDisplayOnLandingPage([item], allAvailableItems);

  if (cardItemsToDisplay.length === 0) {
    return null;
  }

  const arrangedLandingPageItems = arrangeItems([item], cardItemsToDisplay);
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
