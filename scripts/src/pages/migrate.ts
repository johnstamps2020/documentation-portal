import { getAllFilesRecursively } from '../modules/fileOperations';
import { resolve, dirname, relative, parse } from 'path';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { LandingPageSelectorProps } from 'landing-pages/src/components/LandingPage/LandingPageSelector';
import { SectionProps } from 'landing-pages/src/components/LandingPage/Section/Section';
import { LandingPageItemProps } from 'landing-pages/src/pages/LandingPage/LandingPageTypes';

const landingPagesSourceDir = resolve(__dirname, '../../../frontend/pages');
const targetDir = resolve(
  __dirname,
  '../../../landing-pages/src/pages/landing'
);
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
  const matchingTargetFile = relative(
    targetDir,
    resolve(targetFile.replace('.tsx', ''), flailPageLink)
  );

  return matchingTargetFile;
}

function getSelector(
  flailConfig: FlailConfig,
  targetFile: string,
  labelColor: string = 'white'
): LandingPageSelectorProps | undefined {
  if (getIsRelease(targetFile)) {
    return undefined;
  }

  const flailSelector = flailConfig.selector;

  const selectorItems = getItems(flailSelector?.items, targetFile);

  if (!selectorItems) {
    return undefined;
  }

  const currentItem: LandingPageItemProps = {
    label: flailSelector?.selectedItem,
    pagePath: relative(targetDir, targetFile).replace('.tsx', ''),
  };

  const sortedItems = [currentItem, ...selectorItems].sort((a, b) =>
    a.label! > b.label! ? 1 : -1
  );

  return {
    label: flailSelector?.label || 'Select version',
    selectedItemLabel: flailSelector?.selectedItem || '',
    items: sortedItems,
    labelColor: labelColor,
  };
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
      videoIcon: item.link?.includes('brainshark') && true,
    })
  );
}

function getWhatsNew(flailConfig: FlailConfig): string {
  const level1Class = flailConfig.class;

  if (level1Class.match('hakuba')) {
    return `{
      label: 'Hakuba',
      badge: hakubaBadge,
      item: { label: 'Learn more', docId: 'whatsnewhakuba' },
      content: [
        'Content coming soon',
      ],
    }`;
  }

  if (level1Class.match('garmisch')) {
    return `{
      label: 'Garmisch',
      badge: garmischBadge,
      item: { label: 'Learn more', docId: 'whatsnewgarmisch' },
      content: [
        'Self-service production deployments',
        'Automatic post-deployment testing',
        'Custom monitoring and observability',
        'Cloud API enhancements',
        'Multi-product support in APD',
        'Support for importing loss runs into PolicyCenter',
        'Expanded line of business content',
        'InsuranceNow integration with Hi Marley',
        'Support for One Inc ACH payments in InsuranceNow',
        'New analytics dashboards for Cyence',
        'New analytics model for Predict',
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

function getBackgroundProps(
  flailConfig: FlailConfig,
  targetFile: string
): {
  backGroundImports: string;
  backgroundPropValue: string;
} {
  const isRelease = getIsRelease(targetFile);
  if (flailConfig.title === 'Self-managed') {
    return {
      backGroundImports: `import Box from '@mui/material/Box';
    import Typography from '@mui/material/Typography';
    import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        "{\n...baseBackgroundProps,\nbackgroundColor: 'hsl(0, 0%, 98%)',\n}",
    };
  }

  const { level1Class } = getFlailClass(flailConfig);

  if (level1Class.match('hakuba')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import hakubaBackgroundImage from 'images/background-hakuba.svg';
      ${isRelease ? `import hakubaBadge from 'images/badge-hakuba.svg';` : ''}
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), \n  url(${hakubaBackgroundImage}), \n  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,\n},\n}',
    };
  }

  if (level1Class.match('garmisch')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import garmischBackgroundImage from 'images/background-garmisch.png';
      ${
        isRelease
          ? `import garmischBadge from 'images/badge-garmisch.svg';`
          : ''
      }
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), \n  url(${garmischBackgroundImage}), \n  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,\n},\n}',
    };
  }

  if (level1Class.match('flaine')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      ${isRelease ? `import flaineBadge from 'images/badge-flaine.svg';` : ''}
      import flaineBackgroundImage from 'images/background-flaine.png';
      import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{\n...baseBackgroundProps,\nbackgroundImage: {\nxs: `url(${gradientBackgroundImage})`,\nsm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),\n       url(${flaineBackgroundImage}), \n       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,\n},\n}',
    };
  }

  if (level1Class.match('elysian')) {
    return {
      backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
      import elysianBackgroundImage from 'images/background-elysian.png';
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

  if (!level1Class.match('blue-theme')) {
    return {
      backGroundImports: `import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
      backgroundPropValue:
        '{ ...baseBackgroundProps,backgroundColor: `hsl(0, 0%, 98%)`, }',
    };
  }

  return {
    backGroundImports: `import gradientBackgroundImage from 'images/background-gradient.svg';
    import { baseBackgroundProps } from 'pages/LandingPage/LandingPageTypes';`,
    backgroundPropValue:
      '{ ...baseBackgroundProps,backgroundImage: `url(${gradientBackgroundImage})`, }',
  };
}

function getSidebar(flailConfig: FlailConfig) {
  const { level1Class } = getFlailClass(flailConfig);

  if (level1Class.match('elysian')) {
    return `{
      label: 'Implementation Resources',
      items: [
        {
          label: 'Guidewire Testing',
          pagePath: 'testingFramework/elysian',
        },
        {
          label: 'API References',
          pagePath: 'apiReferences',
        },
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
      ],
    }`;
  }

  if (level1Class.match('dobson')) {
    return `{
      label: 'Implementation Resources',
      items: [
        {
          label: 'API References',
          pagePath: 'apiReferences',
        },
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
      ],
    }`;
  }

  return `{
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
}

function mapToCategory2Layout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig, targetFile);
  const cards = flailConfig.items.map((flail) => ({
    label: flail.label,
    items: getItems(flail.items, targetFile),
  }));
  const isRelease = getIsRelease(targetFile);
  return `{
    backgroundProps: ${backgroundPropValue},
    ${isRelease ? 'isRelease: true,' : ''}
    cards: ${JSON.stringify(cards, null, 2)},
    whatsNew: ${getWhatsNew(flailConfig)},
    sidebar: ${getSidebar(flailConfig)},
  }`;
}

function getIsRelease(targetFile: string): boolean {
  if (
    targetFile.match(/landing\/cloudProducts\/[a-z]+.tsx$/) &&
    parse(targetFile).name !== 'cyence'
  ) {
    return true;
  }

  return false;
}

function mapToCategoryLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig, targetFile);
  const cards = flailConfig.items.map((flail) => ({
    label: flail.id ? '' : flail.label,
    items:
      (flail.items &&
        getItems(
          flail.items?.filter((i) => i.items === undefined),
          targetFile
        )) ||
      (flail.id &&
        getItems([{ label: flail.label, id: flail.id }], targetFile)),
    sections: getSections(
      flail.items?.filter((i) => i.items),
      targetFile
    ),
  }));
  const isSelfManaged = flailConfig.title === 'Self-managed';
  const isRelease = getIsRelease(targetFile);
  const selector = getSelector(flailConfig, targetFile);
  return `{
    backgroundProps: ${backgroundPropValue},
    ${
      !isSelfManaged && selector
        ? `selector: ${JSON.stringify(selector, null, 2)},`
        : ''
    }
    ${isRelease ? 'isRelease: true,' : ''}
    ${
      isSelfManaged
        ? `description: (
      <Box padding="1rem 1rem 0rem 1rem">
        <Typography variant="body1" lineHeight={2}>
          Find documentation for the latest releases of Guidewire self-managed
          products.
        </Typography>
        <Typography variant="body1" lineHeight={2}>
          Access earlier releases by clicking a product and then selecting a
          version from the <b>Select release</b> dropdown menu.
        </Typography>
      </Box>
    ),`
        : ''
    }
    cards: ${JSON.stringify(cards, null, 2)},
    ${isSelfManaged ? `isRelease: false` : ''}
    ${isRelease ? `sidebar: ${getSidebar(flailConfig)}` : ''}
  }`;
}

function mapToProductFamilyLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig, targetFile);
  const items = getItems(flailConfig.items, targetFile);
  const selector = getSelector(flailConfig, targetFile);
  const isRelease = getIsRelease(targetFile);
  return `{
    backgroundProps: ${backgroundPropValue},
    ${selector ? `selector: ${JSON.stringify(selector)},` : ''}
    ${isRelease ? `isRelease: ${isRelease},` : ''}
    items: ${JSON.stringify(items, null, 2)},
    sidebar: ${getSidebar(flailConfig)},
  }`;
}

function mapToSectionLayout(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { backgroundPropValue } = getBackgroundProps(flailConfig, targetFile);
  const sections = getSections(flailConfig.items, targetFile);
  const selector = getSelector(flailConfig, targetFile, 'black');
  return `{
    backgroundProps: ${backgroundPropValue},
    sections: ${JSON.stringify(sections, null, 2)},
    ${selector ? `selector: ${JSON.stringify(selector, null, 2)}` : ''}
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

function getClassMap(flailConfig: FlailConfig, targetFile: string): ClassMap {
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

  const isRelease = getIsRelease(targetFile);

  if (
    isRelease &&
    (level1Class.match('garmisch') ||
      level1Class.match('flaine') ||
      level1Class.match('hakuba'))
  ) {
    return category2;
  }

  if (
    isRelease &&
    (level1Class.match('elysian') || level1Class.match('dobson'))
  ) {
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

function getComponentName(targetFile: string) {
  const fileName = parse(targetFile)
    .name.replaceAll('.', '')
    .replaceAll('-', '');
  if (fileName.match(/^\d/)) {
    return `LandingPage${fileName}`;
  }

  return capitalizeFirstLetter(fileName);
}

type FilePair = {
  sourceFile: string;
  targetFile: string;
};

function createComponentTemplate(
  flailConfig: FlailConfig,
  targetFile: string
): string {
  const { componentName, layoutProps, from, remapFunction } = getClassMap(
    flailConfig,
    targetFile
  );
  const pageConfig = remapFunction(flailConfig, targetFile);
  const pageComponentName = getComponentName(targetFile);
  const { backGroundImports } = getBackgroundProps(flailConfig, targetFile);

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

  const flailConfig: FlailConfig = JSON.parse(flailFileContents);

  if (flailConfig.template === 'redirect') {
    continue;
  }

  const componentTemplate = createComponentTemplate(
    flailConfig,
    file.targetFile
  );

  mkdirSync(dirname(file.targetFile), { recursive: true });
  writeFileSync(file.targetFile, componentTemplate, { encoding: 'utf-8' });
}
