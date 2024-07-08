import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useCategory2Context } from './Category2Context';
import Category2Item from './Category2Item';
import { findMatchingPageItemData } from 'helpers/landingPageHelpers';

export type Category2CardProps = {
  label: string;
  items: LandingPageItemProps[];
};
export default function Category2Card({ label, items }: Category2CardProps) {
  const { allAvailableItems } = useCategory2Context();

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
        {items.map((categoryItem, idx) => {
          const matchingItemData = findMatchingPageItemData(
            allAvailableItems,
            categoryItem
          );

          if (!matchingItemData) {
            return null;
          }

          return (
            <Category2Item
              key={idx}
              earlyAccess={matchingItemData.earlyAccess}
              internal={matchingItemData.internal}
              isInProduction={matchingItemData.isInProduction}
              {...categoryItem}
            />
          );
        })}
      </Stack>
    </Paper>
  );
}
