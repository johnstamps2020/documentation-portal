import { createFileRoute } from '@tanstack/react-router';
import LandingPage20222 from './-2022.2';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2022.2':
      return <LandingPage20222 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/flaine/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
