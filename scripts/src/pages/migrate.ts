import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve, dirname } from 'path';
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

function getItems(flailItems: FlailItem[] | undefined): LandingPageItemProps[] {
  if (!flailItems) {
    throw new Error(`Object does not have items`);
  }

  return flailItems.map(
    (item): LandingPageItemProps => ({
      label: item.label,
      docId: item.id,
      pagePath: item.page,
      url: item.link,
    })
  );
}

function getWhatsNew(flailConfig: FlailConfig): WhatsNewProps {
  const level1Class = flailConfig.class;

  if (level1Class.match('garmisch')) {
    return {
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
    };
  }

  return {
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
  };
}

function getBackgroundImage(flailConfig: FlailConfig): string {
  return;
}

const sidebar: SidebarProps = {
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
};

function mapToCategory2Layout(flailConfig: FlailConfig): Category2LayoutProps {
  return {
    backgroundProps: {
      ...baseBackgroundProps,
      backgroundImage: getBackgroundImage(flailConfig),
    },
    cards: flailConfig.items.map((flail) => ({
      label: flail.label,
      items: getItems(flail.items),
    })),
    whatsNew: getWhatsNew(flailConfig),
    sidebar,
  };
}

function mapToCategoryCard(flailConfig: FlailConfig): CategoryLayoutProps {
  return undefined;
}

function mapToProductFamily(
  flailConfig: FlailConfig
): ProductFamilyLayoutProps {
  return undefined;
}

function mapToSection(flailConfig: FlailConfig): SectionLayoutProps {
  return undefined;
}

function remapPageConfig(
  flailConfig: FlailConfig
):
  | CategoryLayoutProps
  | Category2LayoutProps
  | ProductFamilyLayoutProps
  | SectionLayoutProps {
  const level1Class = flailConfig.class;

  if (level1Class.match('garmisch') || level1Class.match('flaine')) {
    return mapToCategory2Layout(flailConfig);
  }

  const level2Class = flailConfig.items[0].class;

  switch (level2Class) {
    case 'categoryCard':
      return mapToCategoryCard(flailConfig);
    case 'productFamily':
      return mapToProductFamily(flailConfig);
    default:
      return mapToSection(flailConfig);
  }
}

const allFiles = getAllFilesRecursively(landingPagesSourceDir);
const filePairs = allFiles.map((sourceFile) => ({
  sourceFile,
  targetFile: sourceFile
    .replace('frontend/pages', 'landing-pages/src/pages/landing')
    .replace('/index.json', '.tsx'),
}));

for (const file of filePairs) {
  const flailFileContents = readFileSync(file.sourceFile, {
    encoding: 'utf-8',
  });

  const pageConfig = remapPageConfig(JSON.parse(flailFileContents));

  mkdirSync(dirname(file.targetFile), { recursive: true });
  writeFileSync(file.targetFile, JSON.stringify(pageConfig, null, 2));
}

// frontend/pages => landing-pages/src/pages/landing
