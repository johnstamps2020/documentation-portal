import { createFileRoute } from '@tanstack/react-router';
import LandingPage202402 from './-2024.02';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2024.02':
      return <LandingPage202402 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/globalContent/messageStore/$version')({
  component: LandingPageComponent,
});
