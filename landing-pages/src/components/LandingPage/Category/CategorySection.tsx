import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import { useLandingPageItems } from '../../../hooks/useLandingPageItems';

export type CategorySectionProps = {
  label: string;
  items: LandingPageItemProps[];
};

export default function CategorySection({
  items,
  label,
}: CategorySectionProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(
    items || []
  );
  if (isLoading || isError || !landingPageItems) {
    return null;
  }
  return (
    <Stack spacing={1}>
      <Typography variant="h3">{label}</Typography>
      {landingPageItems?.map(sectionItem => (
        <CategoryItem {...sectionItem} key={sectionItem.label} />
      ))}
    </Stack>
  );
}
