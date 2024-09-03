import { createFileRoute } from '@tanstack/react-router';
import LandingPage20211 from './-2021.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2021.1':
      return <LandingPage20211 />;
    default:
      break;
  }
}

export const Route = createFileRoute(
  '/cloudProducts/cortina/insuranceNow/$version'
)({
  component: LandingPageComponent,
});
