import { FilterConfig } from './ChatFilter';

export const filtersFromDb: FilterConfig[] = [
  {
    label: 'Product',
    name: 'product',
    values: [
      'Advanced Product Designer',
      'Analytics Manager Solution Templates',
      'App Events Webhooks',
      'PolicyCenter',
      'BillingCenter',
      'ClaimCenter',
      'Global Content',
      'Cloud Platform',
      'Data Platform',
      'Digital Reference Applications',
      'InsuranceNow',
      'Canvas',
      'DataHub',
      'InfoCenter',
      'Rules',
      'Compare',
      'Explore',
      'Guidewire AppReader',
      'Guidewire Cloud Home',
      'Guidewire for Salesforce',
      'Guidewire Home',
      'InsuranceNow Consumer Service Portal',
      'InsuranceSuite Configuration Upgrade Tools',
      'Jutro Design System',
      'Jutro Digital Platform',
      'Jutro SDK',
      'Lifecycle Manager',
      'Predict',
      'Submission Intake',
      'Workflow Service',
      'Workset Manager',
    ],
  },
  {
    label: 'Version',
    name: 'version',
    values: [
      '1.0',
      '10.0',
      '10.0.3',
      '10.2.1',
      '10.2.2',
      '2021.04',
      '2021.11',
      '2022.05',
      '2022.09',
      '2023.02',
      '2023.06',
      '2023.10',
      '2024.02',
      '10.3',
      '2021.1',
      '2021.2',
      '2022.06',
      '2022.1',
      '2022.11',
      '2022.2',
      '2023.2',
      '2023.3',
      '2024.1',
      '2023.1',
      '2023.02ipj',
      '2023.12',
      '3.23',
      '3.24',
      '3.25',
      '3.26',
      '3.3.0',
      '4.0.0',
      '4.1.0',
      '4.2.0',
      '4.4.0',
      '5.0.0',
      '5.1.0',
      '4.5.0',
      '4.3.0',
      '4.6.0',
      '5.2.0',
      '4.7.0',
      '5.3.2 LTS',
      '6.5.2 LTS',
      '7.4.3 LTS',
      '8.10.0 LTS',
      '8.13.2',
      '8.3.2 LTS',
      '8.6.1',
      '8.6.1 LTS',
      'Flaine',
      'Garmisch',
      'Hakuba',
      'Innsbruck',
      'Jasper',
      'latest',
    ],
  },
  {
    label: 'Release',
    name: 'release',
    values: [
      'Garmisch',
      'Hakuba',
      'Innsbruck',
      'Flaine',
      'Elysian',
      'Dobson',
      'Cortina',
    ],
  },
  {
    label: 'Subject',
    name: 'subject',
    values: [
      'Configuration',
      'Administration',
      'Testing',
      'Release notes',
      'Best practices',
      'Features and functionality',
      'Glossary',
      'Integration',
      'Development',
      'Upgrade',
      'Installation',
    ],
  },
  { label: 'Platform', name: 'platform', values: ['Self-managed', 'Cloud'] },
  {
    label: 'Language',
    name: 'language',
    values: ['de', 'en', 'es', 'es-ES', 'fr', 'it', 'ja', 'pt'],
  },
];