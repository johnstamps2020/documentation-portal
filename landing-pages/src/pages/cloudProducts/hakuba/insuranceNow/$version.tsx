import { createFileRoute } from '@tanstack/react-router';
import LandingPage20232 from './-2023.2';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.2':
      return <LandingPage20232 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/hakuba/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
