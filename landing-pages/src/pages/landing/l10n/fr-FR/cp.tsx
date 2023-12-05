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
    label: 'Choisissez un produit',
    selectedItemLabel: 'Cloud Platform',
    items: allSelectors.sef23284b869fc03ddd79bc1738f4ad7d,
    labelColor: 'white',
  },

  cards: [
    {
label: '2023.10 (Innsbruck)', 
items: [
{
label: '[TBD]Cloud Platform Release Notes	', 
docId: 'gwcpfrFRreleasenotes', 
}, 
],
},
{
      label: '2023.06 (Hakuba)',
      items: [
        {
          label: 'Notes de version de la plate-forme Guidewire Cloud',
          docId: 'gwcpfrFRreleasenotes',
        },
      ],
    },
  ],
};

export default function Cp() {
  return <CategoryLayout {...pageConfig} />;
}

