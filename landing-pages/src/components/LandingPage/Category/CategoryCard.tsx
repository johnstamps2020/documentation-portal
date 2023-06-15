import Stack from '@mui/material/Stack';
import LandingPageItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import CategorySection, { CategorySectionProps } from './CategorySection';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import Skeleton from '@mui/material/Skeleton';

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
  const { landingPageItems, isError, isLoading } = useLandingPageItems(
    items || []
  );
  const itemsInSections =
    sections?.map((section) => section.items).flat() || [];

  const {
    landingPageItems: landingPageSectionsItems,
    isError: isErrorSections,
    isLoading: isLoadingSections,
  } = useLandingPageItems(itemsInSections);

  if (
    (isError && isErrorSections) ||
    landingPageItems?.length === 0 ||
    (items === undefined && sections === undefined)
  ) {
    return null;
  }

  if (
    (isLoading && isLoadingSections) ||
    (!landingPageItems && !landingPageSectionsItems)
  ) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '300px', xs: '100%' },
          height: '450px',
        }}
      />
    );
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

      <Stack spacing={1} sx={{ fontSize: '0.875rem', color: 'black' }}>
        {landingPageItems?.map((categoryItem, idx) => (
          <LandingPageItem {...categoryItem} key={idx} />
        ))}
        {sections?.map((section, idx) => (
          <CategorySection {...section} key={idx} />
        ))}
      </Stack>
    </Paper>
  );
}
