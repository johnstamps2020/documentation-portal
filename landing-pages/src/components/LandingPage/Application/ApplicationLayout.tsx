import Stack from '@mui/material/Stack';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import ApplicationHero, { ApplicationHeroProps } from './ApplicationHero';
import ApplicationTabs, { ApplicationTabItemProps } from './ApplicationTabs';
import Container from '@mui/material/Container';

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
      <Container>
        <NotLoggedInInfo />
      </Container>
      <ApplicationTabs tabs={tabs} />
    </Stack>
  );
}
