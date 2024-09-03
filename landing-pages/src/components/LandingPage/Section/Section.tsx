import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LandingPageItemProps } from 'components/LandingPage/LandingPageTypes';
import SectionItem from './SectionItem';
import SectionIcon from './SectionIcon';
import {
  arrangeItems,
  getListOfItemsToDisplayOnLandingPage,
  LandingPageItemData,
} from 'helpers/landingPageHelpers';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

export type SectionProps = {
  label: string;
  items: LandingPageItemProps[];
};

export default function Section({ label, items }: SectionProps) {
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const itemsToDisplay: LandingPageItemData[] =
    getListOfItemsToDisplayOnLandingPage(items, allAvailableItems);

  if (itemsToDisplay.length === 0) {
    return null;
  }

  const arrangedLandingPageItems = arrangeItems(items, itemsToDisplay);

  return (
    <Stack
      spacing={2}
      sx={{
        breakInside: 'avoid',
        width: { xs: '100%', sm: '450px' },
        margin: '0 0 32px 16px',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <SectionIcon label={label} />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'hsl(216, 42%, 13%)',
            textAlign: 'left',
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Stack spacing={1} paddingLeft="40px">
        {arrangedLandingPageItems?.map((sectionItem) => (
          <SectionItem
            {...sectionItem}
            key={`${sectionItem.label}_${sectionItem.internal}`}
          />
        ))}
      </Stack>
    </Stack>
  );
}
