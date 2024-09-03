import { createFileRoute } from '@tanstack/react-router';
import LandingPage330 from './-3.3.0';
import LandingPage331 from './-3.3.1';
import LandingPage34 from './-3.4';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '3.3.0':
      return <LandingPage330 />;
    case '3.3.1':
      return <LandingPage331 />;
    case '3.4':
      return <LandingPage34 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/selfManagedProducts/gwsf/di/$version')({
  component: LandingPageComponent,
});
