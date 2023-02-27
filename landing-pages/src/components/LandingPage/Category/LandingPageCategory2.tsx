import Stack from '@mui/material/Stack';
import LandingPageItem2 from '../LandingPageItem2';
import LandingPageSubCategory from './LandingPageSubCategory';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { LandingPageItem } from '../../../pages/LandingPage/LandingPage';

type LandingPageCategoryProps = {
  label: string;
  items?: LandingPageItem[];
};
export default function LandingPageCategory2(
  category: LandingPageCategoryProps
) {
  return (
    <Paper
      sx={{
        width: { sm: '288px', xs: '100%' },
        padding: '24px',
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
        {category.label}
      </Typography>
      <Divider />
      <Stack spacing={1} sx={{ fontSize: '0.875rem', color: 'black' }}>
        {category.items?.map((categoryItem) => (
          <LandingPageItem2 {...categoryItem} key={categoryItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
