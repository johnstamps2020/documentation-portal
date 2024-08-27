import { render, screen } from '@testing-library/react';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import CategoryCard, { CategoryCardProps } from './CategoryCard';

const bikeLandingPageItems: LandingPageItemProps[] = [
  {
    label: 'Red bicycle',
    videoIcon: true,
    docId: 'redbike',
  },
  {
    label: 'Regular bicycle',
    pagePath: 'bicycles/regular',
  },
];

const title = 'Two-wheelers';

const rendererConfig: CategoryCardProps = {
  label: title,
  items: bikeLandingPageItems,
};

test('renders the card title', () => {
  render(<CategoryCard {...rendererConfig} />);
  const titleElement = screen.getByText(title);
  expect(titleElement).toBeInTheDocument();
});
