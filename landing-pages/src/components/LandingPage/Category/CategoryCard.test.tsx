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
  items: [
    {
      label: 'Red bicycle',
      url: 'https://bicycles.com/red-bike-demo.mp4',
      videoIcon: true,
    },
    {
      label: 'Regular bicycle',
      pagePath: 'regular-bike',
    },
  ],
  sections: [
    {
      label: 'Sports bikes section',
      items: [
        {
          label: 'Speedy bike',
          docId: 'speedy-bike',
        },
      ],
    },
  ],
};

beforeAll(() => {
  render(<CategoryCard {...cardConfig} />);
});

test('renders the card title', () => {
  const titleElement = screen.getByText(title);
  expect(titleElement).toBeInTheDocument();
});
