import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getListOfItemsToDisplayOnLandingPage } from 'helpers/landingPageHelpers';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import Category2Item from './Category2Item';

export type Category2CardProps = {
  label: string;
  items: LandingPageItemProps[];
};
export default function Category2Card({ label, items }: Category2CardProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const cardItemsToDisplay = getListOfItemsToDisplayOnLandingPage(
    items,
    allAvailableItems
  );

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
