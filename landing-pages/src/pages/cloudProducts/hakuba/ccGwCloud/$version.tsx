import { createFileRoute } from '@tanstack/react-router';
import LandingPage202306 from './-2023.06';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2023.06':
      return <LandingPage202306 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/hakuba/ccGwCloud/$version'
)({
  component: LandingPageComponent,
});
