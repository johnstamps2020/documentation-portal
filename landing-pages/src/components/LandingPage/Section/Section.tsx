import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import glossary from 'images/twoColumn/book-open-solid.svg';
import development from 'images/twoColumn/code-solid.svg';
import configuration from 'images/twoColumn/cogs-solid.svg';
import features from 'images/twoColumn/object-group-regular.svg';
import integration from 'images/twoColumn/puzzle-piece-solid.svg';
import administration from 'images/twoColumn/users-cog-solid.svg';
import installation from 'images/twoColumn/wrench-solid.svg';
import releaseNotes from 'images/twoColumn/file-alt-regular.svg';
import bestPractices from 'images/twoColumn/lightbulb-regular.svg';
import aboutThisDocumentation from 'images/twoColumn/book-solid.svg';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import SectionItem from './SectionItem';

const icons = [
  { regex: /glossary/, src: glossary },
  { regex: /development/, src: development },
  { regex: /configuration/, src: configuration },
  { regex: /features/, src: features },
  { regex: /integration/, src: integration },
  { regex: /administration/, src: administration },
  { regex: /installation/, src: installation },
  { regex: /release notes/, src: releaseNotes },
  { regex: /best practices/, src: bestPractices },
  { regex: /about/, src: aboutThisDocumentation },
];

function getIcon(label: string) {
  const matchingIcon = icons.find((icon) =>
    icon.regex.test(label.toLocaleLowerCase())
  );

  return matchingIcon?.src || releaseNotes;
}

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

  const icon = getIcon(label);

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
        <img
          src={icon}
          alt="Section icon"
          style={{
            width: '20px',
            height: '20px',
          }}
        />
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
