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
    label: 'Selecione o produto',
    selectedItemLabel: 'ServiceRepEngage',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Notas de versão',
          docId: 'dx202306ptBRsrerelnotes',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/sre/11.1/pt-SRE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
      ],
    },
    {
      label: '10.0.1',
      items: [
        {
          label: 'Guia de administração e segurança',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/sre/10.0.1/pt-SRE_Admin-and-Security Guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'pt-BR/sre/10.0.1/pt-SRE_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/sre/10.0.1/pt-SRE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/sre/10.0.1/pt-SRE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/sre/10.0.1/pt-SRE_AppGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/sre')({
  component: Sre,
});

function Sre() {
  return <CategoryLayout {...pageConfig} />;
}
