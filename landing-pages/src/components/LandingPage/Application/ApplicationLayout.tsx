import Stack from '@mui/material/Stack';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';
import ApplicationVideoSection, {
  ApplicationVideoSectionProps,
} from './ApplicationVideoSection';

export type ApplicationLayoutProps = ApplicationHeroProps & {
  tabs?: ApplicationTabItemProps[];
  videoSectionProps?: ApplicationVideoSectionProps;
};

export default function ApplicationLayout({
  tabs,
  buttonProps,
  title,
  videoSectionProps,
}: ApplicationLayoutProps) {
  return (
    <Stack gap="35px" sx={{ mb: 10 }}>
      <ApplicationHero buttonProps={buttonProps} title={title} />
      {videoSectionProps && <ApplicationVideoSection {...videoSectionProps} />}
      {tabs && <ApplicationTabs tabs={tabs} />}
    </Stack>
  );
}
