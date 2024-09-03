import { createFileRoute } from '@tanstack/react-router';
import LandingPage20221 from './-2022.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2022.1':
      return <LandingPage20221 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/elysian/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
