import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';

export type CategorySectionProps = {
  label: string;
  items: LandingPageItemProps[];
};

export default function CategorySection({
  items,
  label,
}: CategorySectionProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="h3">{label}</Typography>
      {items?.map(sectionItem => (
        <CategoryItem {...sectionItem} key={sectionItem.label} />
      ))}
    </Stack>
  );
}
