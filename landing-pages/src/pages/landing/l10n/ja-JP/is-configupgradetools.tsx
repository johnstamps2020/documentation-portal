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
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]InsuranceSuite Configuraiton Upgrade Guide', 
docId: 'isconfigupgradetoolsjaJP500', 
}, 
{
label: '[TBD]IS Configuration Upgrade Tools Compatibility', 
docId: 'isupgradecompatibilityjaJP', 
}, 
],
},
{
    {
      label: '4.6.0',
      items: [
        {
          label: 'Upgrade Tools ガイド',
          docId: 'isconfigupgradetoolsja460',
        },
        {
          label: 'コンフィギュレーションアップグレードツールの互換性',
          docId: 'isupgradecompatibilityja',
        },
      ],
    },
    {
      label: '3.2.0',
      items: [
        {
          label: 'ガイド',
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

