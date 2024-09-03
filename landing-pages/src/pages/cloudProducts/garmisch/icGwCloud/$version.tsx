import { createFileRoute } from '@tanstack/react-router';
import LandingPage202302 from './-2023.02';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.02':
      return <LandingPage202302 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/garmisch/icGwCloud/$version'
)({
  component: LandingPageComponent,
});
