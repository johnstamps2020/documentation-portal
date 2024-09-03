import { createFileRoute } from '@tanstack/react-router';
import LandingPage531 from './-5.3.1';
import LandingPage651 from './-6.5.1';
import LandingPage743 from './-7.4.3';
import LandingPage830 from './-8.3.0';
import LandingPage861 from './-8.6.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '5.3.1':
      return <LandingPage531 />;
    case '6.5.1':
      return <LandingPage651 />;
    case '7.4.3':
      return <LandingPage743 />;
    case '8.3.0':
      return <LandingPage830 />;
    case '8.6.1':
      return <LandingPage861 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/jutroDesignSystem/$version')({
  component: LandingPageComponent,
});
