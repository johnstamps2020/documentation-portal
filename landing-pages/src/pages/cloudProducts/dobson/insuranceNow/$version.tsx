import { createFileRoute } from '@tanstack/react-router';
import LandingPage20212 from './-2021.2';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2021.2':
      return <LandingPage20212 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/dobson/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
