import { createFileRoute } from '@tanstack/react-router';
import LandingPage1141 from './-11.4.1';
import LandingPage1150 from './-11.5.0';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '11.4.1':
      return <LandingPage1141 />;
    case '11.5.0':
      return <LandingPage1150 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/selfManagedProducts/vendorEngage/$version'
)({
  component: LandingPageComponent,
});
