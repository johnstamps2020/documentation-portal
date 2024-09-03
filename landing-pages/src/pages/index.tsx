import { createFileRoute } from '@tanstack/react-router';
import LandingPageLayout from 'components/LandingPage/LandingPageLayout';

function HomePage() {
  return <LandingPageLayout>Redirecting...</LandingPageLayout>;
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
