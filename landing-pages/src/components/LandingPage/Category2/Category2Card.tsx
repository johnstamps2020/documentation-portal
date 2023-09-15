import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import Category2Item from './Category2Item';

export type Category2CardProps = {
  label: string;
  items: LandingPageItemProps[];
};
export default function Category2Card({ label, items }: Category2CardProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);

  if (
    isError ||
    (landingPageItems && landingPageItems.length === 0) ||
    !landingPageItems
  ) {
    return null;
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '288px', xs: '100%' },
          height: '300px',
        }}
      />
    );
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
        {landingPageItems?.map((categoryItem) => (
          <Category2Item
            {...categoryItem}
            key={`${categoryItem.label}_${categoryItem.internal}`}
          />
        ))}
      </Stack>
    </Paper>
  );
}
