import { createFileRoute } from '@tanstack/react-router';
import LandingPage202310 from './-2023.10';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.10':
      return <LandingPage202310 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/innsbruck/bcGwCloud/$version'
)({
  component: LandingPageComponent,
});
