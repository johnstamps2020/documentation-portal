import { createFileRoute } from '@tanstack/react-router';
import LandingPage20 from './-2.0';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2.0':
      return <LandingPage20 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/globalContent/ipf/$version')({
  component: LandingPageComponent,
});
