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
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.se8b84bf91d6fdc9fe9f57fab16d97983,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]Cloud Home Help', 
docId: 'gchjaJPhelprelease', 
}, 
{
label: '[TBD]Cloud Platform Release Notes	', 
docId: 'gwcpjaJPreleasenotes', 
}, 
],
},
{
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'Guidewire Cloud Home ヘルプ',
          docId: 'gchjaJPhelprelease',
        },
        {
          label: 'Guidewire Cloud Platform リリースノート',
          docId: 'gwcpjareleasenotes',
        },
      ],
    },
    {
      label: '2022.09 (Flaine)',
      items: [
        {
          label: 'リリースノート',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.09/GWCP-ReleaseNotes_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire Cloud Console ガイド',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'ja-JP/cp/2022.09/guidewire_cloud_platform_guide_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Guidewire Cloud Platform の操作',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.09/CloudPlatform_ja-JP.pdf',
          videoIcon: false,
        },
        {
          label: 'Integration Gateway',
          docId: 'integgatewaydevlatestjaJP',
        },
      ],
    },
    {
      label: '2022.06',
      items: [
        {
          label: 'Cloud Standards',
          docId: 'l10npdfss3folder',
          pathInDoc: 'ja-JP/cp/2022.06/CloudStandards(surepath)-JA.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export default function Cp() {
  return <CategoryLayout {...pageConfig} />;
}

