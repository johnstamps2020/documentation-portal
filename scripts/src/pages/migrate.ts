import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve, dirname, relative } from 'path';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { CategoryLayoutProps } from 'landing-pages/src/components/LandingPage/Category/CategoryLayout';
import { Category2LayoutProps } from 'landing-pages/src/components/LandingPage/Category2/Category2Layout';
import { ProductFamilyLayoutProps } from 'landing-pages/src/components/LandingPage/ProductFamily/ProductFamilyLayout';
import { SectionLayoutProps } from 'landing-pages/src/components/LandingPage/Section/SectionLayout';
import {
  baseBackgroundProps,
  LandingPageItemProps,
  SidebarProps,
} from 'landing-pages/src/pages/LandingPage/LandingPageTypes';
import { WhatsNewProps } from 'landing-pages/src/components/LandingPage/WhatsNew';

const landingPagesSourceDir = resolve(__dirname, '../../../frontend/pages');
const allFiles = getAllFilesRecursively(landingPagesSourceDir);
const filePairs: FilePair[] = allFiles.map((sourceFile) => ({
  sourceFile,
  targetFile: sourceFile
    .replace('frontend/pages', 'landing-pages/src/pages/landing')
    .replace('/index.json', '.tsx'),
}));

type FlailItem = {
  label: string;
  class?: string;
  link?: string;
  id?: string;
  page?: string;
  items?: FlailItem[];
  env?: string[];
};

type FlailConfig = {
  $schema: string;
  title: string;
  template: string;
  includeInBreadcrumbs: boolean;
  class: string;
  items: FlailItem[];
  selector?: {
    label: string;
    class: string;
    selectedItem: string;
    items: FlailItem[];
  };
  search_filters?: {
    [x: string]: string[];
  };
  current_page: {
    label: string;
    path: string;
  };
  breadcrumbs: FlailItem[];
};

function remapPageLink(flailPageLink: string, targetFile: string): string {
  const root = resolve(__dirname, '../../../landing-pages/src/pages/landing');
  const matchingTargetFile = relative(
    root,
    resolve(targetFile.replace('.tsx', ''), flailPageLink)
  );

  return matchingTargetFile;
}

function getItems(
  flailItems: FlailItem[] | undefined,
  targetFile: string
): LandingPageItemProps[] {
  if (!flailItems) {
    throw new Error(`Object does not have items`);
  }

  return flailItems.map(
    (item): LandingPageItemProps => ({
      label: item.label,
      docId: item.id,
      pagePath: item.page ? remapPageLink(item.page, targetFile) : undefined,
      url: item.link,
    })
  );
}

function getWhatsNew(flailConfig: FlailConfig): string {
  const level1Class = flailConfig.class;

  if (level1Class.match('garmisch')) {
    return `{
      label: 'Garmisch',
      badge: 'garmischBadge',
      item: { label: 'Learn more', docId: 'whatsnewgarmisch' },
      content: [
        'Washes your car',
        'Folds the laundry',
        'Enhances the flavor of your food',
        'Makes you feel like a million bucks',
        'Just kidding! Content coming soon.',
      ],
    }`;
  }

  return `{
    label: 'Flaine',
    badge: 'flaineBadge',
    item: { label: 'Learn more', docId: 'whatsnewflaine' },
    content: [
      'Advanced Product Designer app (APD)',
      'Submission Intake for InsuranceSuite',
      'App Events for event-based integration',
      'Community-powered machine learning',
      'Automated updates to latest release',
      'Cloud API enhancements',
      'Early access to Jutro Digital Platform',
      'Expanded Guidewire GO content',
      'Advanced monitoring and observability',
    ],
  }`;
}

function getBackgroundProps(flailConfig: FlailConfig): string {
  const { level1Class } = getFlailClass(flailConfig);

  if (level1Class.match('garmisch')) {
    return '{...baseBackgroundProps,backgroundImage: {xs: `url(${gradientBackgroundImage})`,sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), url(${garmischBackgroundImage}),linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,},},';
  }
  return '{...baseBackgroundProps,backgroundImage: `url(${gradientBackgroundImage})`,},';
}

const sidebar = `{
  label: 'Implementation Resources',
  items: [
    {
      label: 'Community Case Templates',
      docId: 'cloudtickettemplates',
    },
    {
      label: 'Product Adoption',
      docId: 'surepathmethodologymain',
    },
    {
      label: 'Cloud Standards',
      docId: 'standardslatest',
    },
    {
      label: 'Upgrade Diff Reports',
      pagePath: 'upgradediffs',
    },
    {
      label: 'Internal docs',
      docId: 'internaldocslatest',
    },
  ],
}`;

function mapToCategory2Layout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  return `{
    backgroundProps: ${getBackgroundProps(flailConfig)},
    cards: ${JSON.stringify(
      flailConfig.items.map((flail) => ({
        label: flail.label,
        items: getItems(flail.items, targetFile),
      }))
    )},
    whatsNew: ${getWhatsNew(flailConfig)},
    sidebar: ${sidebar},
  }`;
}

function mapToCategoryLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  return {};
}

function mapToProductFamilyLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  return {};
}

function mapToSectionLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  return {};
}

function getFlailClass(flailConfig: FlailConfig) {
  const level1Class = flailConfig.class;
  const level2Class = flailConfig.items[0].class;

  return {
    level1Class,
    level2Class,
  };
}

function getClassMap(flailConfig: FlailConfig): {
  layoutProps: string;
  remapFunction: (flailConfig: FlailConfig, targetFile: string) => string;
} {
  const { level1Class, level2Class } = getFlailClass(flailConfig);

  if (level1Class.match('garmisch') || level1Class.match('flaine')) {
    return {
      layoutProps: 'Category2LayoutProps',
      remapFunction: mapToCategory2Layout,
    };
  }

  switch (level2Class) {
    case 'categoryCard':
      return {
        layoutProps: 'CategoryLayoutProps',
        remapFunction: mapToCategoryLayout,
      };
    case 'productFamily':
      return {
        layoutProps: 'ProductFamilyLayoutProps',
        remapFunction: mapToProductFamilyLayout,
      };
    default:
      return {
        layoutProps: 'SectionLayoutProps',
        remapFunction: mapToSectionLayout,
      };
  }
}

type FilePair = {
  sourceFile: string;
  targetFile: string;
};

function createComponentTemplate(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { layoutProps, remapFunction } = getClassMap(flailConfig);
  const pageConfig = remapFunction(flailConfig, targetFile);

  return `const pageConfig: ${layoutProps} = ${pageConfig};`;
}

for (const file of filePairs) {
  const flailFileContents = readFileSync(file.sourceFile, {
    encoding: 'utf-8',
  });

  const componentTemplate = createComponentTemplate(
    JSON.parse(flailFileContents),
    file.targetFile
  );

  mkdirSync(dirname(file.targetFile), { recursive: true });
  writeFileSync(file.targetFile, componentTemplate, { encoding: 'utf-8' });
}
