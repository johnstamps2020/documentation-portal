import { createFileRoute } from '@tanstack/react-router';
import LandingPage32 from './-3.2';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '3.2':
      return <LandingPage32 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/globalContent/iplm/$version')({
  component: LandingPageComponent,
});
