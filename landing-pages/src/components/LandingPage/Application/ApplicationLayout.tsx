import Stack from '@mui/material/Stack';
import ApplicationHero from './ApplicationHero';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';

export type ApplicationLayoutProps = {
  tabs: ApplicationTabItemProps[];
};

export default function ApplicationLayout({ tabs }: ApplicationLayoutProps) {
  return (
    <Stack gap="35px" sx={{ mb: 10 }}>
      <ApplicationHero />
      <ApplicationTabs tabs={tabs} />
    </Stack>
  );
}
