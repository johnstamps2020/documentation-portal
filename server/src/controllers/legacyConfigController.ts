import {
  createOrUpdateEntity,
  findEntity,
  getAllEntities,
} from './configController';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { Resource } from '../model/entity/Resource';
import { Source } from '../model/entity/Source';
import path, { join, resolve } from 'path';
import { AppDataSource } from '../model/connection';
import {
  legacyBuildConfig,
  legacyBuildsConfigFile,
  legacyDocConfig,
  legacyDocsConfigFile,
  legacyItem,
  legacyPageConfig,
  legacySourceConfig,
  legacySourcesConfigFile,
  Metadata,
} from '../types/legacyConfig';
import { Build } from '../model/entity/Build';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { ProductName } from '../model/entity/ProductName';
import { ProductPlatform } from '../model/entity/ProductPlatform';
import { ProductVersion } from '../model/entity/ProductVersion';
import { Page } from '../model/entity/Page';
import { winstonLogger } from './loggerController';
import { CategoryItem } from '../model/entity/CategoryItem';
import { SubjectItem } from '../model/entity/SubjectItem';
import { Category } from '../model/entity/Category';
import { Subject } from '../model/entity/Subject';
import { SubCategory } from '../model/entity/SubCategory';
import { SubCategoryItem } from '../model/entity/SubCategoryItem';
import { ProductFamilyItem } from '../model/entity/ProductFamilyItem';
import { Item } from '../model/entity/Item';
import { PageSelectorItem } from '../model/entity/PageSelectorItem';
import { PageSelector } from '../model/entity/PageSelector';
import { SidebarItem } from '../model/entity/SidebarItem';
import { Sidebar } from '../model/entity/Sidebar';
import { getConfigFile, listItems } from './s3Controller';
import { runningInDevMode } from './utils/serverUtils';

export async function getLegacyDocConfigs() {
  const { status, body } = await getAllEntities(Doc.name);
  const dbDocs: Doc[] = body;
  const legacyDocs = [];
  if (status === 200) {
    for (const doc of dbDocs) {
      const legacyDoc = new legacyDocConfig();
      legacyDoc.id = doc.id;
      legacyDoc.title = doc.title;
      legacyDoc.url = doc.url;
      legacyDoc.body = doc.body;
      legacyDoc.environments = doc.isInProduction
        ? ['int', 'staging', 'prod']
        : ['int', 'staging'];
      legacyDoc.displayOnLandingPages = doc.displayOnLandingPages;
      legacyDoc.indexForSearch = doc.indexForSearch;
      legacyDoc.public = doc.public;
      legacyDoc.internal = doc.internal;
      legacyDoc.earlyAccess = doc.earlyAccess;
      legacyDoc.metadata = new Metadata();
      legacyDoc.metadata.product = doc.products.map(
        (p: Product) => p.name.name
      );
      legacyDoc.metadata.platform = doc.products.map(
        (p: Product) => p.platform.name
      );
      legacyDoc.metadata.version = doc.products.map(
        (p: Product) => p.version.name
      );
      legacyDoc.metadata.release = doc.releases
        ? doc.releases.map((r: Release) => r.name)
        : null;
      legacyDoc.metadata.subject = doc.subjects || null;

      legacyDocs.push(legacyDoc);
    }
  }
  return {
    status: 200,
    body: legacyDocs,
  };
}

export async function getLegacyBuildConfigs() {
  const { status, body } = await getAllEntities(Doc.name);
  const legacyBuilds = [];
  if (status === 200) {
    for (const doc of body) {
      const buildData = doc.build;
      const legacyBuild = new legacyBuildConfig();
      if (buildData) {
        legacyBuild.buildType = buildData.type;
        legacyBuild.root = buildData.root;
        legacyBuild.filter = buildData.filter;
        legacyBuild.indexRedirect = buildData.indexRedirect;
        legacyBuild.nodeImageVersion = buildData.nodeImageVersion;
        legacyBuild.workingDir = buildData.workingDir;
        legacyBuild.yarnBuildCustomCommand = buildData.yarnBuildCustomCommand;
        legacyBuild.outputPath = buildData.outputPath;
        legacyBuild.zipFilename = buildData.zipFilename;
        legacyBuild.customEnv = buildData.customEnv;
        legacyBuild.srcId = buildData.source.id;
        legacyBuild.docId = doc.id;
        legacyBuild.resources = buildData.resources.map((rs: Resource) => {
          return {
            sourceFolder: rs.sourceFolder,
            targetFolder: rs.targetFolder,
            srcId: rs.source.id,
          };
        });
      }
      legacyBuilds.push(legacyBuild);
    }
  }
  return {
    status: 200,
    body: legacyBuilds,
  };
}

export async function getLegacySourceConfigs() {
  const { status, body } = await getAllEntities(Source.name);
  const legacySources = [];
  if (status === 200) {
    for (const src of body) {
      const legacySource = new legacySourceConfig();
      legacySource.id = src.id;
      legacySource.title = src.name;
      legacySource.sourceType = src.type;
      legacySource.gitUrl = src.gitUrl;
      legacySource.branch = src.gitBranch;
      legacySource.xdocsPathIds = src.xdocsPathIds;
      legacySource.exportFrequency = src.exportFrequency;
      legacySource.pollInterval = src.pollInterval;
      legacySources.push(legacySource);
    }
  }
  return {
    status: 200,
    body: legacySources,
  };
}

export function readLocalDocConfigs(dirPath: string): legacyDocConfig[] {
  try {
    const localConfig: legacyDocConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalDocConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: legacyDocsConfigFile = JSON.parse(config);
        localConfig.push(...json.docs);
      }
    }
    return localConfig;
  } catch (funcErr) {
    throw new Error(
      `Cannot read local config file from path: ${dirPath}: ${funcErr}`
    );
  }
}

export function readLocalBuildConfigs(dirPath: string): legacyBuildConfig[] {
  try {
    const localConfig: legacyBuildConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalBuildConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: legacyBuildsConfigFile = JSON.parse(config);
        localConfig.push(...json.builds);
      }
    }
    return localConfig;
  } catch (funcErr) {
    throw new Error(
      `Cannot read local config file from path: ${dirPath}: ${funcErr}`
    );
  }
}

export function readLocalSourceConfigs(dirPath: string): legacySourceConfig[] {
  try {
    const localConfig: legacySourceConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalSourceConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: legacySourcesConfigFile = JSON.parse(config);
        localConfig.push(...json.sources);
      }
    }
    return localConfig;
  } catch (funcErr) {
    throw new Error(
      `Cannot read local config file from path: ${dirPath}: ${funcErr}`
    );
  }
}

export function readLocalPageConfigs(dirPath: string): legacyPageConfig[] {
  try {
    const localConfig: legacyPageConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalPageConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: legacyPageConfig = JSON.parse(config);
        json.path = dirPath;
        localConfig.push(json);
      }
    }
    return localConfig;
  } catch (funcErr) {
    throw new Error(
      `Cannot read local config file from path: ${dirPath}: ${funcErr}`
    );
  }
}

function getBackgroundComponent(pagePath: string) {
  const backgroundPathMapping = {
    'cloudProducts/aspen': 'aspenBackground',
    'cloudProducts/banff': 'banffBackground',
    'cloudProducts/cortina': 'cortinaBackground',
    'cloudProducts/dobson': 'dobsonBackground',
    'cloudProducts/elysian': 'elysianBackground',
    'cloudProducts/flaine': 'flaineBackground',
  };
  let background = null;
  Object.entries(backgroundPathMapping).forEach(([k, v]) => {
    if (k === pagePath) {
      background = v;
    }
  });
  return background;
}

async function updateRefsInItem(
  legacyItem: legacyItem,
  dbItem: Item,
  legacyLandingPageConfigs: legacyPageConfig[],
  rootPath: string
): Promise<Item> {
  if (legacyItem.id) {
    const getDocResult = await findEntity(Doc.name, {
      id: legacyItem.id,
    });
    dbItem.doc = getDocResult.status === 200 ? getDocResult.body : undefined;
  } else if (legacyItem.page) {
    const pagePath = legacyItem.page;
    const pagePathWithRoot = path.join(rootPath, pagePath);
    const relativePagePath = getRelativePagePath(pagePathWithRoot);
    const getPageResult = await findEntity(Page.name, {
      path: relativePagePath,
    });
    dbItem.page = getPageResult.status === 200 ? getPageResult.body : undefined;
  } else if (legacyItem.link) {
    dbItem.link = legacyItem.link;
  }
  return dbItem;
}

async function getOrCreateItems(
  rootPath: string,
  legacyItems: legacyItem[],
  legacyLandingPageConfigs: legacyPageConfig[]
): Promise<{
  categories: Category[];
  subjects: Subject[];
  productFamilyItems: ProductFamilyItem[];
}> {
  async function getOrCreateSubItems(
    legacySubItems: legacyItem[],
    parentItem: Category | Subject | SubCategory
  ): Promise<Item[]> {
    const dbPageSubItems = [];
    for (const legacySubItem of legacySubItems) {
      let dbPageSubItem;
      let dbPageSubItemRepo;
      if (parentItem instanceof SubCategory) {
        dbPageSubItem = new SubCategoryItem();
        dbPageSubItemRepo = SubCategoryItem.name;
      } else if (parentItem instanceof Category) {
        dbPageSubItem = new CategoryItem();
        dbPageSubItemRepo = CategoryItem.name;
      } else {
        dbPageSubItem = new SubjectItem();
        dbPageSubItemRepo = SubjectItem.name;
      }
      dbPageSubItem.label = legacySubItem.label;

      const dbPageSubItemWithRefs = await updateRefsInItem(
        legacySubItem,
        dbPageSubItem,
        legacyLandingPageConfigs,
        rootPath
      );
      const result = await createOrUpdateEntity(
        dbPageSubItemRepo,
        dbPageSubItemWithRefs
      );
      dbPageSubItems.push(result.body);
    }
    return dbPageSubItems;
  }

  const dbPageCategories = [];
  const dbPageSubjects = [];
  const dbPageProductFamilyItems = [];
  for (const legacyItem of legacyItems) {
    try {
      if (legacyItem.class?.includes('categoryCard')) {
        const allLegacyItemItems = legacyItem.items;
        if (allLegacyItemItems) {
          const dbPageCategory = new Category();
          dbPageCategory.label = legacyItem.label;
          const legacySubCategoryItems = allLegacyItemItems.filter(
            i => i.class?.includes('group') && i.items
          );
          const legacyCategoryItems = allLegacyItemItems.filter(
            i => !legacySubCategoryItems.includes(i)
          );
          const subCategories = [];
          if (legacySubCategoryItems) {
            for (const legacySubCategoryItem of legacySubCategoryItems) {
              const legacySubCategoryItemItems = legacySubCategoryItem.items;
              if (legacySubCategoryItemItems) {
                const subCategory = new SubCategory();
                subCategory.label = legacySubCategoryItem.label;
                subCategory.subCategoryItems = await getOrCreateSubItems(
                  legacySubCategoryItemItems,
                  subCategory
                );
                const saveResult = await createOrUpdateEntity(
                  SubCategory.name,
                  subCategory
                );
                subCategories.push(saveResult.body);
              }
            }
            dbPageCategory.subCategories = subCategories;
          }
          if (legacyCategoryItems) {
            dbPageCategory.categoryItems = await getOrCreateSubItems(
              legacyCategoryItems,
              dbPageCategory
            );
          }
          const result = await createOrUpdateEntity(
            Category.name,
            dbPageCategory
          );
          dbPageCategories.push(result.body);
        }
      } else if (legacyItem.class?.includes('subject')) {
        const dbPageSubject = new Subject();
        dbPageSubject.label = legacyItem.label;
        if (legacyItem.items) {
          dbPageSubject.subjectItems = await getOrCreateSubItems(
            legacyItem.items,
            dbPageSubject
          );
        }
        const result = await createOrUpdateEntity(Subject.name, dbPageSubject);
        dbPageSubjects.push(result.body);
      } else if (legacyItem.class?.includes('productFamily')) {
        const dbPageProductFamilyItem = new ProductFamilyItem();
        dbPageProductFamilyItem.label = legacyItem.label;
        const dbPageProductFamilyItemWithRefs = await updateRefsInItem(
          legacyItem,
          dbPageProductFamilyItem,
          legacyLandingPageConfigs,
          rootPath
        );
        const result = await createOrUpdateEntity(
          ProductFamilyItem.name,
          dbPageProductFamilyItemWithRefs
        );
        dbPageProductFamilyItems.push(result.body);
      }
    } catch (err) {
      winstonLogger.error(`Error in item: ${legacyItem.label}, ${err}`);
    }
  }
  return {
    categories: dbPageCategories,
    subjects: dbPageSubjects,
    productFamilyItems: dbPageProductFamilyItems,
  };
}

function getRelativePagePath(absPagePath: string): string {
  return absPagePath.split('pages/')[1] || '/';
}

export async function putOpenRoutesConfigsInDatabase() {
  try {
    const openPaths = [
      {
        path: 'gw-login',
        component: 'page',
        title: 'Login',
      },
      {
        path: 'search',
        component: 'page',
        title: 'Search',
      },
      {
        path: '404',
        component: 'page',
        title: '404',
      },
      {
        path: 'forbidden',
        component: 'page',
        title: 'Forbidden',
      },
      {
        path: 'static',
        component: 'resource',
        title: 'Static',
      },
      {
        path: 'landing-page-resources',
        component: 'resource',
        title: 'Landing page resources',
      },
    ];
    const openRouteConfigs = [];
    for (const openPath of openPaths) {
      const openRouteConfig = new Page();
      openRouteConfig.path = openPath.path;
      openRouteConfig.title = openPath.title;
      openRouteConfig.public = true;
      openRouteConfig.internal = false;
      openRouteConfig.earlyAccess = false;
      openRouteConfig.component = openPath.component;
      openRouteConfig.isInProduction = false;
      const result = await createOrUpdateEntity(Page.name, openRouteConfig);
      openRouteConfigs.push(result.body);
    }
    return {
      status: 200,
      body: openRouteConfigs,
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot put open route config in DB: ${
          (err as Error).message
        }`,
      },
    };
  }
}

export async function putPageConfigsInDatabase() {
  try {
    const isDevMode = runningInDevMode();
    let localLandingPagesConfigDir: string;
    if (isDevMode) {
      localLandingPagesConfigDir = resolve(
        `${__dirname}/../../../frontend/pages`
      );
    } else {
      localLandingPagesConfigDir = resolve(
        `${__dirname}/../legacyConfig/landingPages`
      );
      const getLegacyLandingPagesObjectsResult = await listItems(
        'legacy-landing-pages'
      );
      const legacyLandingPages = getLegacyLandingPagesObjectsResult.Contents?.map(
        i => i.Key
      );
      if (legacyLandingPages) {
        for (const legacyLandingPage of legacyLandingPages) {
          const targetLocalDir = legacyLandingPage!
            .replace('legacy-landing-pages', localLandingPagesConfigDir)
            .replace('/index.json', '');
          const getLegacyLandingPageConfigResult = await getConfigFile(
            targetLocalDir,
            'index.json',
            legacyLandingPage
          );
          if (getLegacyLandingPageConfigResult !== 'success') {
            return {
              status: 404,
              body: {
                message: `Cannot put page config in DB: Problem getting the page config file from S3 (${legacyLandingPage})`,
              },
            };
          }
        }
      }
    }

    const localLandingPagesConfig = readLocalPageConfigs(
      localLandingPagesConfigDir
    );
    const pageConfigs = [];
    for (const page of localLandingPagesConfig) {
      const dbLandingPage = new Page();
      const legacyPageAbsPath = page.path;
      dbLandingPage.path = getRelativePagePath(legacyPageAbsPath);
      dbLandingPage.title = page.title;
      const bgComponent = getBackgroundComponent(dbLandingPage.path);
      dbLandingPage.component = bgComponent
        ? page.template + ` ${bgComponent}`
        : page.template;
      dbLandingPage.isInProduction = false;
      const pageSaveResult = await createOrUpdateEntity(
        Page.name,
        dbLandingPage
      );
      pageConfigs.push({ legacyPage: page, dbPage: pageSaveResult.body });
    }
    const dbPageConfigs = [];
    for (const pageConfig of pageConfigs) {
      const legacyPageConfig = pageConfig.legacyPage;
      const dbPageConfig = pageConfig.dbPage;
      const legacyPageAbsPath = legacyPageConfig.path;
      if (legacyPageConfig.items) {
        const allPageItems = await getOrCreateItems(
          legacyPageAbsPath,
          legacyPageConfig.items,
          localLandingPagesConfig
        );
        const pageCategories = allPageItems.categories;
        const pageSubjects = allPageItems.subjects;
        const pageProductFamilyItems = allPageItems.productFamilyItems;
        dbPageConfig.categories = [];
        dbPageConfig.subjects = [];
        dbPageConfig.productFamilyItems = [];
        if (pageCategories.length > 0) {
          for (const c of pageCategories) {
            const result = await createOrUpdateEntity(Category.name, c);
            dbPageConfig.categories.push(result.body);
          }
        } else if (pageSubjects.length > 0) {
          for (const s of pageSubjects) {
            const result = await createOrUpdateEntity(Subject.name, s);
            dbPageConfig.subjects.push(result.body);
          }
        } else if (pageProductFamilyItems.length > 0) {
          for (const p of pageProductFamilyItems) {
            const result = await createOrUpdateEntity(
              ProductFamilyItem.name,
              p
            );
            dbPageConfig.productFamilyItems.push(result.body);
          }
        }
      }
      const legacyPageSelector = legacyPageConfig.selector;
      if (legacyPageSelector) {
        const pageSelector = new PageSelector();
        pageSelector.label = legacyPageSelector.label;
        pageSelector.selectedItemLabel = legacyPageSelector.selectedItem;
        const pageSelectorItems = [];
        for (const legacyPageSelectorItem of legacyPageSelector.items) {
          const pageSelectorItem = new PageSelectorItem();
          pageSelectorItem.label = legacyPageSelectorItem.label;
          const pageSelectorItemWithRefs = await updateRefsInItem(
            legacyPageSelectorItem,
            pageSelectorItem,
            localLandingPagesConfig,
            legacyPageAbsPath
          );
          const result = await createOrUpdateEntity(
            PageSelectorItem.name,
            pageSelectorItemWithRefs
          );
          pageSelectorItems.push(result.body);
        }
        // Create an item for the currently selected item
        const currentlySelectedPageSelectorItem = new PageSelectorItem();
        currentlySelectedPageSelectorItem.label =
          legacyPageSelector.selectedItem;
        currentlySelectedPageSelectorItem.link = '#';
        const selectedPageSelectorItemSaveResult = await createOrUpdateEntity(
          PageSelectorItem.name,
          currentlySelectedPageSelectorItem
        );
        pageSelectorItems.push(selectedPageSelectorItemSaveResult.body);
        pageSelector.pageSelectorItems = pageSelectorItems;
        const pageSelectorSaveResult = await createOrUpdateEntity(
          PageSelector.name,
          pageSelector
        );
        dbPageConfig.pageSelector = pageSelectorSaveResult.body;
      }
      const legacySearchFilters = legacyPageConfig.search_filters;
      if (legacySearchFilters) {
        dbPageConfig.searchFilters = legacySearchFilters;
      }
      // Temporary sidebar for testing
      if (legacyPageConfig.path.endsWith('cloudProducts/elysian')) {
        const sidebarItems = [];

        const sidebarItemDoc = new SidebarItem();
        const docResponse = await findEntity(Doc.name, {
          id: 'amstcccounterfraud',
        });
        sidebarItemDoc.label = 'Counter Fraud ClaimCenter';
        sidebarItemDoc.doc = docResponse.body;
        const sidebarItemDocSaveResult = await createOrUpdateEntity(
          SidebarItem.name,
          sidebarItemDoc
        );
        sidebarItems.push(sidebarItemDocSaveResult.body);

        const testPageConfig = new Page();
        testPageConfig.path = 'cloudProducts/elysian';
        testPageConfig.title = 'Test Page Config';
        testPageConfig.component = 'page';
        testPageConfig.isInProduction = false;
        const createdPage = await createOrUpdateEntity(
          Page.name,
          testPageConfig
        );
        const sidebarItemPage = new SidebarItem();
        sidebarItemPage.label = 'API References';
        sidebarItemPage.page = createdPage.body;
        const sidebarItemPageSaveResult = await createOrUpdateEntity(
          SidebarItem.name,
          sidebarItemPage
        );
        sidebarItems.push(sidebarItemPageSaveResult.body);

        const sidebarItemLink = new SidebarItem();
        sidebarItemLink.link = '/alive';
        sidebarItemLink.label = 'Alive';
        const sidebarItemLinkSaveResult = await createOrUpdateEntity(
          SidebarItem.name,
          sidebarItemLink
        );
        sidebarItems.push(sidebarItemLinkSaveResult.body);

        const sidebar = new Sidebar();
        sidebar.label = 'Implementation resources';
        sidebar.sidebarItems = sidebarItems;
        const sidebarSaveResult = await createOrUpdateEntity(
          Sidebar.name,
          sidebar
        );
        dbPageConfig.sidebar = sidebarSaveResult.body;
      }
      const pageSaveResult = await createOrUpdateEntity(
        Page.name,
        dbPageConfig
      );
      dbPageConfigs.push(pageSaveResult.body);
    }
    return {
      status: 200,
      body: dbPageConfigs,
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot put source config in DB: ${err}`,
      },
    };
  }
}

export async function putSourceConfigsInDatabase(): Promise<{
  status: number;
  body: any;
}> {
  try {
    const isDevMode = runningInDevMode();
    let localSourcesConfigDir: string;
    if (isDevMode) {
      localSourcesConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/sources`
      );
    } else {
      localSourcesConfigDir = resolve(`${__dirname}/../legacyConfig/sources`);
      const getSourcesConfigResult = await getConfigFile(
        localSourcesConfigDir,
        'sources.json',
        'legacy-config/sources.json'
      );
      if (getSourcesConfigResult !== 'success') {
        return {
          status: 404,
          body: {
            message: `Cannot put doc config in DB: Problem getting the doc config file from S3 (${getSourcesConfigResult})`,
          },
        };
      }
    }

    const localSourcesConfig = readLocalSourceConfigs(localSourcesConfigDir);
    const dbSourceConfigs = [];
    for await (const source of localSourcesConfig) {
      const dbSource = new Source();
      dbSource.id = source.id;
      dbSource.name = source.title;
      dbSource.type = source.sourceType;
      dbSource.gitUrl = source.gitUrl;
      dbSource.gitBranch = source.branch;
      dbSource.xdocsPathIds = source.xdocsPathIds;
      dbSource.exportFrequency = source.exportFrequency;
      dbSource.pollInterval = source.pollInterval;

      const saveResult = await createOrUpdateEntity(Source.name, dbSource);
      dbSourceConfigs.push(saveResult.body);
    }
    return {
      status: 200,
      body: dbSourceConfigs,
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot put source config in DB: ${(err as Error).message}`,
      },
    };
  }
}

async function getOrCreateEntities(
  legacyItems: string[],
  repoName: string,
  mainKey: string
) {
  const items = [];
  for (const i of legacyItems) {
    const { status, body } = await findEntity(repoName, {
      [mainKey]: i,
    });
    if (status === 404) {
      const { status, body } = await createOrUpdateEntity(repoName, {
        [mainKey]: i,
      });
      if (status === 200) {
        items.push(body);
      }
    } else if (status === 200) {
      items.push(body);
    }
  }
  return items;
}

async function createProductEntities(
  productConfigs: {
    productName: string;
    platformName: string;
    versionName: string;
  }[]
): Promise<Product[]> {
  const dbDocProducts = [];
  for (const productConfig of productConfigs) {
    const productName = await findEntity(ProductName.name, {
      name: productConfig.productName,
    });
    const platformName = await findEntity(ProductPlatform.name, {
      name: productConfig.platformName,
    });
    const versionName = await findEntity(ProductVersion.name, {
      name: productConfig.versionName,
    });
    const productEntitySaveResult = await createOrUpdateEntity(Product.name, {
      name: productName.body,
      platform: platformName.body,
      version: versionName.body,
    });
    dbDocProducts.push(productEntitySaveResult.body);
  }
  return dbDocProducts;
}

async function addDocBuild(buildConfig: legacyBuildConfig) {
  const docBuild = new Build();
  const matchingBuildSrc = await findEntity(Source.name, {
    id: buildConfig.srcId,
  });
  docBuild.type = buildConfig.buildType;
  docBuild.root = buildConfig.root;
  docBuild.filter = buildConfig.filter;
  docBuild.source = matchingBuildSrc.body;
  docBuild.indexRedirect = buildConfig.indexRedirect;
  docBuild.nodeImageVersion = buildConfig.nodeImageVersion;
  docBuild.workingDir = buildConfig.workingDir;
  docBuild.yarnBuildCustomCommand = buildConfig.yarnBuildCustomCommand;
  docBuild.outputPath = buildConfig.outputPath;
  docBuild.zipFilename = buildConfig.zipFilename;
  docBuild.customEnv = buildConfig.customEnv;
  const saveResult = await createOrUpdateEntity(Build.name, docBuild);
  return saveResult.body;
}

export async function putDocConfigsInDatabase(): Promise<{
  status: number;
  body: any;
}> {
  try {
    const isDevMode = runningInDevMode();
    let localDocsConfigDir: string;
    let localBuildsConfigDir: string;
    if (isDevMode) {
      localDocsConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/docs`
      );
      localBuildsConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/builds`
      );
    } else {
      localDocsConfigDir = resolve(`${__dirname}/../legacyConfig/docs`);
      const getDocsConfigResult = await getConfigFile(
        localDocsConfigDir,
        'docs.json',
        'legacy-config/docs.json'
      );
      if (getDocsConfigResult !== 'success') {
        return {
          status: 404,
          body: {
            message: `Cannot put doc config in DB: Problem getting the doc config file from S3 (${getDocsConfigResult})`,
          },
        };
      }
      localBuildsConfigDir = resolve(`${__dirname}/../legacyConfig/builds`);
      const getBuildsConfigResult = await getConfigFile(
        localBuildsConfigDir,
        'builds.json',
        'legacy-config/builds.json'
      );
      if (getBuildsConfigResult !== 'success') {
        return {
          status: 404,
          body: {
            message: `Cannot put doc config in DB: Problem getting the builds config file from S3 (${getBuildsConfigResult})`,
          },
        };
      }
    }

    const localDocsConfig = readLocalDocConfigs(localDocsConfigDir);
    const localBuildsConfig = readLocalBuildConfigs(localBuildsConfigDir);
    const dbDocConfigs = [];
    for await (const doc of localDocsConfig) {
      const dbDoc = new Doc();
      dbDoc.id = doc.id;
      dbDoc.url = doc.url;
      dbDoc.title = doc.title;
      dbDoc.public = doc.public;
      dbDoc.internal = doc.internal;
      dbDoc.earlyAccess = doc.earlyAccess;
      dbDoc.displayOnLandingPages = doc.displayOnLandingPages;
      dbDoc.isInProduction = doc.environments.includes('prod');
      dbDoc.indexForSearch = doc.indexForSearch;

      // Find releases and create if needed
      let docReleases = [];
      const legacyDocReleases = doc.metadata.release;
      if (legacyDocReleases) {
        docReleases = await getOrCreateEntities(
          legacyDocReleases,
          Release.name,
          'name'
        );
      }
      dbDoc.releases = docReleases.length > 0 ? docReleases : null;
      // Find products and create if needed
      const legacyDocProducts = doc.metadata.product;
      if (legacyDocProducts) {
        await getOrCreateEntities(legacyDocProducts, ProductName.name, 'name');
      }
      const legacyDocPlatforms = doc.metadata.platform;
      if (legacyDocPlatforms) {
        await getOrCreateEntities(
          legacyDocPlatforms,
          ProductPlatform.name,
          'name'
        );
      }
      const legacyDocVersions = doc.metadata.version;
      if (legacyDocVersions) {
        await getOrCreateEntities(
          legacyDocVersions,
          ProductVersion.name,
          'name'
        );
      }
      const productConfigCombinations = [];
      for (const product of legacyDocProducts) {
        for (const platform of legacyDocPlatforms) {
          for (const version of legacyDocVersions) {
            productConfigCombinations.push({
              productName: product,
              platformName: platform,
              versionName: version,
            });
          }
        }
      }
      dbDoc.products = await createProductEntities(productConfigCombinations);

      const matchingBuild = localBuildsConfig.find(b => b.docId === doc.id);
      if (matchingBuild) {
        dbDoc.build = await addDocBuild(matchingBuild);
      }

      const saveResult = await createOrUpdateEntity(Doc.name, dbDoc);
      dbDocConfigs.push(saveResult.body);
    }

    return {
      status: 200,
      body: dbDocConfigs,
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot put doc config in DB: ${(err as Error).message}`,
      },
    };
  }
}
