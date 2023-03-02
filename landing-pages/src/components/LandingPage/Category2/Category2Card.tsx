import Stack from '@mui/material/Stack';
import Category2Item from './Category2Item';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import { useLandingPageItems } from '../../../hooks/useLandingPageItems';

type LandingPageCategoryProps = {
  label: string;
  items: LandingPageItemProps[];
};
export default function Category2Card({
  label,
  items,
}: LandingPageCategoryProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);
  if (isLoading || isError || !landingPageItems) {
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
      <Stack spacing={1} sx={{ fontSize: '0.875rem', color: 'black' }}>
        {landingPageItems?.map(categoryItem => (
          <Category2Item {...categoryItem} key={categoryItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
