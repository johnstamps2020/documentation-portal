import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import SectionItem from './SectionItem';
import SectionIcon from './SectionIcon';

export type SectionProps = {
  label: string;
  items: LandingPageItemProps[];
};

export default function Section({ label, items }: SectionProps) {
  const { landingPageItems, isLoading, isError } = useLandingPageItems(items);

  if (isError || landingPageItems?.length === 0) {
    return null;
  }

  if (isLoading || !landingPageItems) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '450px', xs: '100%' },
          height: '200px',
          margin: '0 0 32px 16px',
        }}
      />
    );
  }

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
        {landingPageItems?.map((sectionItem) => (
          <SectionItem
            {...sectionItem}
            key={`${sectionItem.label}_${sectionItem.internal}`}
          />
        ))}
      </Stack>
    </Stack>
  );
}
