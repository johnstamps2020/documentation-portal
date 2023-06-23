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
      label: 'Release Notes',
      items: [
        {
          label: 'Data Access',
          docId: 'clouddataaccessrn',
        },
        {
          label: 'Data Platform',
          url: '/cloud/dataplatform/topics/c_rn-new-changed.html',
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

export default function DataPlatform() {
  return <SectionLayout {...pageConfig} />;
}
