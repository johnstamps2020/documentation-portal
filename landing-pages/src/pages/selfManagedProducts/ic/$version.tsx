import { createFileRoute } from '@tanstack/react-router';
import LandingPage10100 from './-10.10.0';
import LandingPage10110 from './-10.11.0';
import LandingPage10120 from './-10.12.0';
import LandingPage10130 from './-10.13.0';
import LandingPage1050 from './-10.5.0';
import LandingPage1060 from './-10.6.0';
import LandingPage1070 from './-10.7.0';
import LandingPage1080 from './-10.8.0';
import LandingPage1090 from './-10.9.0';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '10.5.0':
      return <LandingPage1050 />;
    case '10.6.0':
      return <LandingPage1060 />;
    case '10.7.0':
      return <LandingPage1070 />;
    case '10.8.0':
      return <LandingPage1080 />;
    case '10.9.0':
      return <LandingPage1090 />;
    case '10.10.0':
      return <LandingPage10100 />;
    case '10.11.0':
      return <LandingPage10110 />;
    case '10.12.0':
      return <LandingPage10120 />;
    case '10.13.0':
      return <LandingPage10130 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/selfManagedProducts/ic/$version')({
  component: LandingPageComponent,
});
