import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';
import { allSelectors } from 'pages/landing/selectors/allSelectors';

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
      label: 'コンフィギュレーションアップグレードツールの互換性',
      docId: 'isjaJPupgradecompatibility',
    },
    {
      label: '5.1.0',
      items: [
        {
          label: 'InsuranceSuite Configuration Upgrade Tools ガイド',
          docId: 'isconfigupgradetools510jaJP',
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

export default function Isconfigupgradetools() {
  return <CategoryLayout {...pageConfig} />;
}
