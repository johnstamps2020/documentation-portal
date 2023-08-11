import { render, screen } from '@testing-library/react';
import CategoryCard, { CategoryCardProps } from './CategoryCard';
import { LandingPageItemData } from 'hooks/useLandingPageItems';

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

jest.mock('hooks/useLandingPageItems', () => ({
  useLandingPageItems: () => ({
    landingPageItems: bikeLandingPageItemData,
    isError: false,
    isLoading: false,
  }),
}));

const title = 'Two-wheelers';

const cardConfig: CategoryCardProps = {
  label: title,
  items: [],
};

test('renders the card title', () => {
  render(<CategoryCard {...cardConfig} />);
  const titleElement = screen.getByText(title);
  expect(titleElement).toBeInTheDocument();
});
