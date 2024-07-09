import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import Category2Item from './Category2Item';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';
import { LandingPageItemData } from 'hooks/hookTypes';

export type Category2CardProps = {
  label: string;
  items: LandingPageItemProps[];
};
export default function Category2Card({ label, items }: Category2CardProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const cardItemsToDisplay = items
    .map((categoryItem, idx) => {
      const matchingItemData = findMatchingPageItemData(
        allAvailableItems,
        categoryItem
      );

      if (!matchingItemData) {
        return null;
      }

      const returnItem: LandingPageItemData = {
        ...categoryItem,
        earlyAccess: matchingItemData.earlyAccess,
        internal: matchingItemData.internal,
        isInProduction: matchingItemData.isInProduction,
      };

      return returnItem;
    })
    .filter((item) => item !== null);

  if (cardItemsToDisplay.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        width: { sm: '288px', xs: '100%' },
        padding: '24px',
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
        {label}
      </Typography>
      <Divider />
      <Stack gap={2} py={2} sx={{}}>
        {cardItemsToDisplay.map((item, idx) => (
          <Category2Item
            key={idx}
            {...item}
            internal={item?.internal || false}
            earlyAccess={item?.earlyAccess || false}
            isInProduction={item?.isInProduction || false}
          />
        ))}
      </Stack>
    </Paper>
  );
}
