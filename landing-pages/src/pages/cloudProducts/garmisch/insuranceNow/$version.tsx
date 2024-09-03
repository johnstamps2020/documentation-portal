import { createFileRoute } from '@tanstack/react-router';
import LandingPage20231 from './-2023.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.1':
      return <LandingPage20231 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/garmisch/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
