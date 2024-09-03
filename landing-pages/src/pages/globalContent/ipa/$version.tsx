import { createFileRoute } from '@tanstack/react-router';
import LandingPage10 from './-1.0';
import LandingPage202209 from './-2022.09';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '1.0':
      return <LandingPage10 />;
    case '2022.09':
      return <LandingPage202209 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/globalContent/ipa/$version')({
  component: LandingPageComponent,
});
