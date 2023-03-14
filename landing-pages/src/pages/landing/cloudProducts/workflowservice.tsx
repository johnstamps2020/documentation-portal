import SectionLayout, {
  SectionLayoutProps,
} from 'components/LandingPage/Section/SectionLayout';
import gradientBackgroundImage from 'images/background-gradient.svg';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';

const pageConfig: SectionLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundImage: `url(${gradientBackgroundImage})`,
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
          label: 'Cockpit',
          docId: 'workflowcockpit',
        },
      ],
    },
  ],
};

export default function Workflowservice() {
  return <SectionLayout {...pageConfig} />;
}
