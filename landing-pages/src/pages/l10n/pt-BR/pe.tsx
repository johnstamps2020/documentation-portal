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
    selectedItemLabel: 'ProducerEngage',
    items: allSelectors.s04aae4cce94a63b38358bb52ee3acace,
    labelColor: 'white',
  },

  cards: [
    {
      label: '2023.06',
      items: [
        {
          label: 'Guia do Notas de versão',
          docId: 'dx202306ptBRperelnotes',
        },
      ],
    },
    {
      label: '11.1',
      items: [
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pe/11.1/pt-PE-onprem_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pe/11.1/pt-PE-cloud_InstallGuide.pdf',
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
          pathInDoc: 'pt-BR/pe/10.0.1/pt-PE_Admin and Security Guide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pe/10.0.1/pt-PE_InstallGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia do aplicativo',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pe/10.0.1/pt-PE_AppGuide.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de instalação e configuração do Live Style Guide',
          docId: 'l10npdfss3folder',
          pathInDoc:
            'pt-BR/pe/10.0.1/pt-PE_Live Style Guide Install and Config.pdf',
          videoIcon: false,
        },
        {
          label: 'Guia de configuração',
          docId: 'l10npdfss3folder',
          pathInDoc: 'pt-BR/pe/10.0.1/pt-PE_ConfigurationGuide.pdf',
          videoIcon: false,
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/l10n/pt-BR/pe')({
  component: Pe,
});

function Pe() {
  return <CategoryLayout {...pageConfig} />;
}
