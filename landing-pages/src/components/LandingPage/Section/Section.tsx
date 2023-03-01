import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import bookOpenIcon from '../../../images/twoColumn/book-open-solid.svg';
import codeIcon from '../../../images/twoColumn/code-solid.svg';
import cogsIcon from '../../../images/twoColumn/cogs-solid.svg';
import ObjectGroupIcon from '../../../images/twoColumn/object-group-regular.svg';
import puzzlePieceIcon from '../../../images/twoColumn/puzzle-piece-solid.svg';
import usersCogIcon from '../../../images/twoColumn/users-cog-solid.svg';
import wrenchIcon from '../../../images/twoColumn/wrench-solid.svg';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import SectionItem from './SectionItem';

export type SectionProps = {
  label: string;
  items?: LandingPageItemProps[];
};

export default function Section({ label, items }: SectionProps) {
  const iconArray = [
    bookOpenIcon,
    codeIcon,
    cogsIcon,
    ObjectGroupIcon,
    puzzlePieceIcon,
    usersCogIcon,
    wrenchIcon,
  ];
  const randomIcon = iconArray[Math.floor(Math.random() * iconArray.length)];

  return (
    <Stack
      spacing={2}
      sx={{
        breakInside: 'avoid',
        width: { xs: '100%', sm: '450px' },
        m: '0 0 32px 16px',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <img
          src={randomIcon}
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
      {items?.map(sectionItem => (
          <SectionItem {...sectionItem} key={sectionItem.label} />
        ))}
      </Stack>
    </Stack>
  );
}
