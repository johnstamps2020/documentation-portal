import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve, dirname, relative, parse } from 'path';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { CategoryLayoutProps } from 'landing-pages/src/components/LandingPage/Category/CategoryLayout';
import { Category2LayoutProps } from 'landing-pages/src/components/LandingPage/Category2/Category2Layout';
import { ProductFamilyLayoutProps } from 'landing-pages/src/components/LandingPage/ProductFamily/ProductFamilyLayout';
import { SectionLayoutProps } from 'landing-pages/src/components/LandingPage/Section/SectionLayout';
import { SectionProps } from 'landing-pages/src/components/LandingPage/Section/Section';
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

function getSections(
  flailItems: FlailItem[] | undefined,
  targetFile: string
): SectionProps[] | undefined {
  if (!flailItems || flailItems.length === 0) {
    return undefined;
  }

  return flailItems.map((item) => ({
    label: item.label,
    items: getItems(item.items, targetFile) || [],
  }));
}

function getItems(
  flailItems: FlailItem[] | undefined,
  targetFile: string
): LandingPageItemProps[] | undefined {
  if (!flailItems || flailItems.length === 0) {
    return undefined;
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
      badge: garmischBadge,
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
    badge: flaineBadge,
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

function getBackgroundProps(flailConfig: FlailConfig): {
  backGroundImports: string;
  backgroundPropValue: string;
} {
  const { level1Class } = getFlailClass(flailConfig);

  if (level1Class.match('garmisch')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import garmischBackgroundImage from 'images/background-garmisch.png';
      import garmischBadge from 'images/badge-garmisch.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), \n  url(${garmischBackgroundImage}), \n  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,\n},\n}',
    };
  }

  if (level1Class.match('flaine')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import flaineBadge from 'images/badge-flaine.svg';
      import flaineBackgroundImage from 'images/background-flaine.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),\n       url(${flaineBackgroundImage}), \n       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,\n},\n}',
    };
  }

  if (level1Class.match('elysian')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import elysianBackgroundImage from 'images/background-elysian.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `url(${elysianBackgroundImage})`,\n},\n}',
    };
  }

  if (level1Class.match('dobson')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import dobsonBackgroundImage from 'images/background-dobson.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\n      sm: `url(${dobsonBackgroundImage})`,\n},\n}',
    };
  }

  if (level1Class.match('cortina')) {
    return {
      backGroundImports: `import cortinaBackgroundImage from 'images/background-cortina.svg';
      import gradientBackgroundImage from 'images/background-gradient.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nsm: `url(${cortinaBackgroundImage})`,\n      xs: `url(${gradientBackgroundImage})`,\n},\n}',
    };
  }

  if (level1Class.match('banff')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import banffBackgroundImage from 'images/background-banff.svg';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nsm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,\nxs: `url(${gradientBackgroundImage})`,\n},\n}',
    };
  }

  return {
    backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
    import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
    backgroundPropValue:
      '{ ...baseBackgroundProps,backgroundImage: `url(${gradientBackgroundImage})`, }',
  };
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
  const { backgroundPropValue } = getBackgroundProps(flailConfig);
  const cards = flailConfig.items.map((flail) => ({
    label: flail.label,
    items: getItems(flail.items, targetFile),
  }));
  return `{
    backgroundProps: ${backgroundPropValue},
    cards: ${JSON.stringify(cards, null, 2)},
    whatsNew: ${getWhatsNew(flailConfig)},
    sidebar: ${sidebar},
  }`;
}

function mapToCategoryLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig);
  const cards = flailConfig.items.map((flail) => ({
    label: flail.label,
    items: getItems(
      flail.items?.filter((i) => i.items === undefined),
      targetFile
    ),
    sections: getSections(
      flail.items?.filter((i) => i.items),
      targetFile
    ),
  }));
  return `{
    backgroundProps: ${backgroundPropValue},
    cards: ${JSON.stringify(cards, null, 2)},
    sidebar: ${sidebar}
  }`;
}

function mapToProductFamilyLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig);
  const items = getItems(flailConfig.items, targetFile);
  return `{
    backgroundProps: ${backgroundPropValue},
    items: ${JSON.stringify(items, null, 2)},
    sidebar: ${sidebar},
  }`;
}

function mapToSectionLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig);
  const cards = flailConfig.items.map((flail) => ({
    label: flail.label,
    items: getItems(
      flail.items?.filter((i) => i.items === undefined),
      targetFile
    ),
    sections: getSections(
      flail.items?.filter((i) => i.items),
      targetFile
    ),
  }));
  return `{
    backgroundProps: ${backgroundPropValue},
    cards: ${JSON.stringify(cards, null, 2)},
    sidebar: ${sidebar}
  }`;
}

function getFlailClass(flailConfig: FlailConfig) {
  const level1Class = flailConfig.class;
  const level2Class = flailConfig.items[0].class;

  return {
    level1Class,
    level2Class,
  };
}

type ClassMap = {
  componentName: string;
  layoutProps: string;
  from: string;
  remapFunction: (flailConfig: FlailConfig, targetFile: string) => string;
};

function getClassMap(flailConfig: FlailConfig): ClassMap {
  const { level1Class, level2Class } = getFlailClass(flailConfig);

  const category2: ClassMap = {
    componentName: 'Category2Layout',
    layoutProps: 'Category2LayoutProps',
    from: 'components/LandingPage/Category2/Category2Layout',
    remapFunction: mapToCategory2Layout,
  };

  const category: ClassMap = {
    componentName: 'CategoryLayout',
    layoutProps: 'CategoryLayoutProps',
    from: 'components/LandingPage/Category/CategoryLayout',
    remapFunction: mapToCategoryLayout,
  };

  const productFamily: ClassMap = {
    componentName: 'ProductFamilyLayout',
    layoutProps: 'ProductFamilyLayoutProps',
    from: 'components/LandingPage/ProductFamily/ProductFamilyLayout',
    remapFunction: mapToProductFamilyLayout,
  };

  const section: ClassMap = {
    componentName: 'SectionLayout',
    layoutProps: 'SectionLayoutProps',
    from: 'components/LandingPage/Section/SectionLayout',
    remapFunction: mapToSectionLayout,
  };

  if (level1Class.match('garmisch') || level1Class.match('flaine')) {
    return category2;
  }

  if (level1Class.match('elysian') || level1Class.match('dobson')) {
    return category;
  }

  if (level2Class?.match('categoryCard')) {
    return category;
  }

  if (level2Class?.match('productFamily')) {
    return productFamily;
  }

  return section;
}

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

type FilePair = {
  sourceFile: string;
  targetFile: string;
};

function createComponentTemplate(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { componentName, layoutProps, from, remapFunction } =
    getClassMap(flailConfig);
  const pageConfig = remapFunction(flailConfig, targetFile);
  const pageComponentName = capitalizeFirstLetter(parse(targetFile).name);
  const { backGroundImports } = getBackgroundProps(flailConfig);

  return `import ${componentName}, { ${layoutProps} } from '${from}';
${backGroundImports}

const pageConfig: ${layoutProps} = ${pageConfig};

export default function ${pageComponentName}() {
  return <${componentName} {...pageConfig} />
}
`;
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
