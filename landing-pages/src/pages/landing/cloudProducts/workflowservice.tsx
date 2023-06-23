import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

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
          label: 'Workflow Console',
          docId: 'workflowconsole',
        },
      ],
    },
  ],
};

export default function Workflowservice() {
  return <SectionLayout {...pageConfig} />;
}
