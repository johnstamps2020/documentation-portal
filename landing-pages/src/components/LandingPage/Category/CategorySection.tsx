import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import { getListOfItemsToDisplayOnLandingPage } from '../../../helpers/landingPageHelpers';

export type CategorySectionProps = {
  label: string;
  items: LandingPageItemProps[];
};

export default function CategorySection({
  items,
  label,
}: CategorySectionProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const sectionItemsToDisplay = getListOfItemsToDisplayOnLandingPage(
    items,
    allAvailableItems
  );

  if (sectionItemsToDisplay.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h3">{label}</Typography>
      {sectionItemsToDisplay?.map((item, idx) => (
        <CategoryItem {...item} key={idx} />
      ))}
    </Stack>
  );
}
