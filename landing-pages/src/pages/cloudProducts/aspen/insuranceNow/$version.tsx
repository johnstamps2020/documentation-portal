import { createFileRoute } from '@tanstack/react-router';
import LandingPage20201 from './-2020.1';

function LandingPageComponent() {
  const { version } = Route.useParams();
  switch (version) {
    case '2020.1':
      return <LandingPage20201 />;
    default:
      break;
  }
}

export const Route = createFileRoute('/cloudProducts/aspen/insuranceNow/$version')(
  {
    component: LandingPageComponent,
  }
);
