import { createFileRoute } from '@tanstack/react-router';
import LandingPage310 from './-3.10';
import LandingPage311 from './-3.11';
import LandingPage36 from './-3.6';
import LandingPage37 from './-3.7';
import LandingPage38 from './-3.8';
import LandingPage39 from './-3.9';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '3.6':
      return <LandingPage36 />;
    case '3.7':
      return <LandingPage37 />;
    case '3.8':
      return <LandingPage38 />;
    case '3.9':
      return <LandingPage39 />;
    case '3.10':
      return <LandingPage310 />;
    case '3.11':
      return <LandingPage311 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/globalContent/ipg/$version')({
  component: LandingPageComponent,
});
