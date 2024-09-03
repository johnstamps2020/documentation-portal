import { createFileRoute } from '@tanstack/react-router';
import LandingPage1021 from './-10.2.1';
import LandingPage1022 from './-10.2.2';
import LandingPage1023 from './-10.2.3';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '10.2.1':
      return <LandingPage1021 />;
    case '10.2.2':
      return <LandingPage1022 />;
    case '10.2.3':
      return <LandingPage1023 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/selfManagedProducts/pc/$version')({
  component: LandingPageComponent,
});
