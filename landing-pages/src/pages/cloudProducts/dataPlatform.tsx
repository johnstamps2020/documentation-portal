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
      label: 'Release Notes',
      items: [
        {
          label: 'Data Access',
          docId: 'clouddataaccessrn',
        },
        {
          label: 'Data Platform',
          docId: 'dataplatform',
          pathInDoc: 'topics/c_rn-new-changed.html',
          videoIcon: false,
        },
      ],
    },
    {
      label: 'Application Guides',
      items: [
        {
          label: 'Data Access',
          docId: 'clouddataaccessguide',
        },
        {
          label: 'Data Platform',
          docId: 'dataplatform',
        },
      ],
    },
    {
      label: 'Internal Documentation',
      items: [
        {
          label: 'Data Access',
          docId: 'clouddataaccessinternal',
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/cloudProducts/dataPlatform')({
  component: DataPlatform,
});

function DataPlatform() {
  return <SectionLayout {...pageConfig} />;
}
