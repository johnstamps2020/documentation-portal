import Stack from '@mui/material/Stack';
import LandingPageItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import CategorySection, { CategorySectionProps } from './CategorySection';

export type CategoryCardProps = {
  label: string;
  items?: LandingPageItemProps[];
  sections?: CategorySectionProps[];
};

export default function CategoryCard({
  label,
  items,
  sections,
}: CategoryCardProps) {
  return (
    <Paper
      sx={{
        width: {
          sm: '300px',
          xs: '100%',
        },
        padding: '24px',
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
        {label}
      </Typography>
      <Stack spacing={1} sx={{ fontSize: '0.875rem', color: 'black' }}>
        {items?.map(categoryItem => (
          <LandingPageItem {...categoryItem} key={categoryItem.label} />
        ))}
        {sections?.map(section => (
          <CategorySection {...section} />
        ))}
      </Stack>
    </Paper>
  );
}
