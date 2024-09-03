import { createFileRoute } from '@tanstack/react-router';
import LandingPage330 from './-3.3.0';
import LandingPage331 from './-3.3.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '3.3.0':
      return <LandingPage330 />;
    case '3.3.1':
      return <LandingPage331 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/selfManagedProducts/gwsf/ed/$version')({
  component: LandingPageComponent,
});
