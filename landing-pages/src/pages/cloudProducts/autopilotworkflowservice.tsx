import { createFileRoute } from '@tanstack/react-router';
import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  sections: [
    {
      label: 'Release notes',
      items: [
        {
          label: 'Release Notes',
          docId: 'workflowreleasenotes',
        },
      ],
    },
    {
      label: 'Development',
      items: [
        {
          label: 'Workflow Designer',
          docId: 'workflowdesigner',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Workflow Administration',
          docId: 'workflowconsole',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/autopilotworkflowservice')(
  {
    component: Autopilotworkflowservice,
  }
);

function Autopilotworkflowservice() {
  return <SectionLayout {...pageConfig} />;
}
