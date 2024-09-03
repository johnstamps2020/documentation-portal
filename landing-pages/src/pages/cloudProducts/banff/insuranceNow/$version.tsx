import { createFileRoute } from '@tanstack/react-router';
import LandingPage20202 from './-2020.2';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2020.2':
      return <LandingPage20202 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/banff/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
