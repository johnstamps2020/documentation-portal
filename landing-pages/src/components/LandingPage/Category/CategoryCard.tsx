import Stack from '@mui/material/Stack';
import LandingPageItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import CategorySection, { CategorySectionProps } from './CategorySection';
import { getListOfItemsToDisplayOnLandingPage } from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

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
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const cardItemsToDisplay = getListOfItemsToDisplayOnLandingPage(
    items || [],
    allAvailableItems
  );

  if (cardItemsToDisplay.length === 0 && sections?.length === 0) {
    return null;
  }

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
      {label !== '' && (
        <Typography
          variant="h2"
          sx={{ fontSize: '1.25rem', fontWeight: '600' }}
        >
          {label}
        </Typography>
      )}
      <Stack sx={{ fontSize: '0.875rem', color: 'black', gap: 1 }}>
        {cardItemsToDisplay?.map((item, idx) => (
          <LandingPageItem {...item} key={idx} />
        ))}
        {sections?.map((section, idx) => (
          <CategorySection {...section} key={idx} />
        ))}
      </Stack>
    </Paper>
  );
}
