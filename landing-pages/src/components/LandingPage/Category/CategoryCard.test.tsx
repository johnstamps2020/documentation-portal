import { render, screen } from '@testing-library/react';
import { LandingPageItemData } from 'hooks/useLandingPageItems';
import LandingPageItem from './CategoryItem';
import LandingPageItemRenderer, {
  LandingPageItemRendererProps,
} from '../LandingPageItemRenderer';
import { Paper, Typography, Skeleton, Stack } from '@mui/material';

const bikeLandingPageItemData: LandingPageItemData[] = [
  {
    label: 'Red bicycle',
    videoIcon: true,
    internal: false,
    earlyAccess: false,
    isInProduction: true,
  },
  {
    label: 'Regular bicycle',
    internal: true,
    earlyAccess: false,
    isInProduction: true,
  },
];

const title = 'Two-wheelers';

const categoryCardItem = (
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
      {title}
    </Typography>
    <Stack sx={{ fontSize: '0.875rem', color: 'black', gap: 1 }}>
      {bikeLandingPageItemData?.map((categoryItem, idx) => (
        <LandingPageItem {...categoryItem} key={idx} />
      ))}
    </Stack>
  </Paper>
);

const categoryCardSkeleton = (
  <Skeleton
    variant="rectangular"
    sx={{
      width: { sm: '300px', xs: '100%' },
      height: '450px',
    }}
  />
);

const rendererConfig: LandingPageItemRendererProps = {
  item: categoryCardItem,
  skeleton: categoryCardSkeleton,
  landingPageItems: bikeLandingPageItemData,
  isLoading: false,
  isError: undefined,
};

test('renders the card title', () => {
  render(<LandingPageItemRenderer {...rendererConfig} />);
  const titleElement = screen.getByText(title);
  expect(titleElement).toBeInTheDocument();
});
