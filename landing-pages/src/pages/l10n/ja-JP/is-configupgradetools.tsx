import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';
import { allSelectors } from 'components/allSelectors';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },
  selector: {
    label: '製品を選択',
    selectedItemLabel: 'InsuranceSuite Configuration Upgrade Tools',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
      label: '互換性の一覧表',
      items: [
        {
          label: 'コンフィギュレーションアップグレードツールの互換性',
          docId: 'isjaJPupgradecompatibility',
        },
      ],
    },
    {
      label: '5.2.0',
      items: [
        {
          label: 'InsuranceSuite Configuration Upgrade Tools ガイド',
          docId: 'isconfigupgradetools520jaJP',
        },
      ],
    },
    {
      label: '5.0.0',
      items: [
        {
          label: 'InsuranceSuite Configuration Upgrade Tools ガイド',
          docId: 'isconfigupgradetoolsjaJP500',
        },
      ],
    },
    {
      label: '4.6.0',
      items: [
        {
          label: 'InsuranceSuite Configuration Upgrade Tools ガイド',
          docId: 'isconfigupgradetoolsja460',
        },
      ],
    },
    {
      label: '3.2.0',
      items: [
        {
          label: 'Upgrade Tools ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/is-configupgradetools/3.2.0/InsuranceSuiteConfigurationUpgradeTools.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/ja-JP/is-configupgradetools')({
  component: Isconfigupgradetools,
});

function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
