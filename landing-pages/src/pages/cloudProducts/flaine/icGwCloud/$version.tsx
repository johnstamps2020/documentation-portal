import { createFileRoute } from '@tanstack/react-router';
import LandingPage202209 from './-2022.09';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2022.09':
      return <LandingPage202209 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/flaine/icGwCloud/$version'
)({
  component: LandingPageComponent,
});
