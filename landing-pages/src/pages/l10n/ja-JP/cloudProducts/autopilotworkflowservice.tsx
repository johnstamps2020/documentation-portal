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
      label: 'リリースノート',
      items: [
        {
          label: 'リリースノート',
          docId: 'workflow202401jaJPreleasenotes',
        },
      ],
    },
    {
      label: '開発環境',
      items: [
        {
          label: 'Workflow Designer',
          docId: 'workflow202401jaJPdesigner',
        },
      ],
    },
    {
      label: '管理',
      items: [
        {
          label: 'Workflow 管理',
          docId: 'workflow202401jaJPconsole',
        },
      ],
    },
  ],
};

export const Route = createFileRoute(
  '/l10n/ja-JP/cloudProducts/autopilotworkflowservice'
)({
  component: Autopilotworkflowservice,
});

function Autopilotworkflowservice() {
  return <SectionLayout {...pageConfig} />;
}
