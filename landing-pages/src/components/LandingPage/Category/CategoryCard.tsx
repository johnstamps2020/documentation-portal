import Stack from '@mui/material/Stack';
import LandingPageItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import CategorySection, { CategorySectionProps } from './CategorySection';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import Skeleton from '@mui/material/Skeleton';
import { arrangeItems } from 'helpers/landingPageHelpers';
import LandingPageItemRenderer from '../LandingPageItemRenderer';

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

  const arrangedLandingPageItems = arrangeItems(items, landingPageItems);
  const arrangedLandingPageSectionsItems = arrangeItems(
    itemsInSections,
    landingPageSectionsItems
  );

  if (items === undefined && sections === undefined) {
    return null;
  }

  return (
    <LandingPageItemRenderer
      landingPageItems={arrangedLandingPageItems}
      landingPageSectionsItems={arrangedLandingPageSectionsItems}
      isLoading={isLoading}
      isLoadingSections={isLoadingSections}
      isError={isError}
      isErrorSections={isErrorSections}
      skeleton={
        <Skeleton
          variant="rectangular"
          sx={{
            width: { sm: '300px', xs: '100%' },
            height: '450px',
          }}
        />
      }
      item={
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
            {landingPageItems?.map((categoryItem, idx) => (
              <LandingPageItem {...categoryItem} key={idx} />
            ))}
            {sections?.map((section, idx) => (
              <CategorySection {...section} key={idx} />
            ))}
          </Stack>
        </Paper>
      }
    />
  );
}
