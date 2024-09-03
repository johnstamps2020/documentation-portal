import { createFileRoute } from '@tanstack/react-router';
import LandingPage20233 from './-2023.3';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.3':
      return <LandingPage20233 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/innsbruck/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
