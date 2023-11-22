import Stack from '@mui/material/Stack';
import { ApplicationCardProps } from './ApplicationCard';
import ApplicationCardSection from './ApplicationCardSection';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';
import ApplicationVideoSection, {
  ApplicationVideoSectionProps,
} from './ApplicationVideoSection';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

export type ApplicationLayoutProps = ApplicationHeroProps & {
  tabs?: ApplicationTabItemProps[];
  videoSectionProps?: ApplicationVideoSectionProps;
  cards?: ApplicationCardProps[];
  resources?: LandingPageItemProps[];
};

export default function ApplicationLayout({
  tabs,
  cards,
  buttonProps,
  heroDescription,
  title,
  videoSectionProps,
}: ApplicationLayoutProps) {
  return (
    <Stack gap="35px" sx={{ mb: 10 }}>
      <ApplicationHero
        buttonProps={buttonProps}
        title={title}
        heroDescription={heroDescription}
      />
      {videoSectionProps && <ApplicationVideoSection {...videoSectionProps} />}
      {tabs && <ApplicationTabs tabs={tabs} />}
      {cards && <ApplicationCardSection items={cards} />}
    </Stack>
  );
}
