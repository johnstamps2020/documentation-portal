import Stack from '@mui/material/Stack';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';

export type ApplicationLayoutProps = ApplicationHeroProps & {
  tabs: ApplicationTabItemProps[];
};

export default function ApplicationLayout({
  tabs,
  buttonProps,
  title,
}: ApplicationLayoutProps) {
  return (
    <Stack gap="35px" sx={{ mb: 10 }}>
      <ApplicationHero buttonProps={buttonProps} title={title} />
      <ApplicationTabs tabs={tabs} />
    </Stack>
  );
}
