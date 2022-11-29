import {
  createOrUpdateEntity,
  getAllEntities,
  getEntity,
} from './configController';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { Resource } from '../model/entity/Resource';
import { integer } from '@elastic/elasticsearch/api/types';
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

async function updateRefsInItem(
  legacyItem: legacyItem,
  dbItem: Item,
  legacyLandingPageConfigs: legacyPageConfig[],
  rootPath: string
): Promise<Item> {
  if (legacyItem.id) {
    const { status, body } = await getEntity(Doc.name, {
      id: legacyItem.id,
    });
    if (status === 200) {
      dbItem.doc = body;
    }
  } else if (legacyItem.page) {
    const pagePath = legacyItem.page;
    const pagePathWithRoot = path.join(rootPath, pagePath);
    const relativePagePath = getRelativePagePath(pagePathWithRoot);
    const { status, body } = await getEntity(Page.name, {
      path: relativePagePath,
    });
    if (status === 200) {
      dbItem.page = body;
    } else {
      const pageConfigToCreate = legacyLandingPageConfigs.find(
        i => i.path === pagePath
      );
      if (pageConfigToCreate) {
        const dbPageConfig = new Page();
        dbPageConfig.path = pagePath;
        dbPageConfig.title = pageConfigToCreate.title;
        dbPageConfig.component = pageConfigToCreate.template;
        dbPageConfig.searchFilters = pageConfigToCreate.search_filters;
        dbPageConfig.isInProduction = legacyItem.env
          ? legacyItem.env.includes('prod')
          : false;

        const createdPage = await createOrUpdateEntity(Page.name, dbPageConfig);
        dbItem.page = createdPage.body;
      }
    }
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
      await createOrUpdateEntity(dbPageSubItemRepo, dbPageSubItemWithRefs);
      dbPageSubItems.push(dbPageSubItemWithRefs);
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
                await AppDataSource.manager.save(SubCategory, subCategory);
                subCategories.push(subCategory);
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
          dbPageCategories.push(dbPageCategory);
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
        dbPageSubjects.push(dbPageSubject);
      } else if (legacyItem.class?.includes('productFamily')) {
        const dbPageProductFamilyItem = new ProductFamilyItem();
        dbPageProductFamilyItem.label = legacyItem.label;
        const dbPageProductFamilyItemWithRefs = await updateRefsInItem(
          legacyItem,
          dbPageProductFamilyItem,
          legacyLandingPageConfigs,
          rootPath
        );
        dbPageProductFamilyItems.push(dbPageProductFamilyItemWithRefs);
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

export async function putPageConfigsInDatabase() {
  try {
    const localLandingPagesConfigDir = resolve(
      `${__dirname}/../../../frontend/pages`
    );

    const localLandingPagesConfig = readLocalPageConfigs(
      localLandingPagesConfigDir
    );
    const dbPageConfigs = [];
    for (const page of localLandingPagesConfig) {
      const dbLandingPage = new Page();
      const legacyPageAbsPath = page.path;
      dbLandingPage.path = getRelativePagePath(legacyPageAbsPath);
      dbLandingPage.title = page.title;
      dbLandingPage.component = page.template;
      dbLandingPage.isInProduction = false;
      if (page.items) {
        const allPageItems = await getOrCreateItems(
          legacyPageAbsPath,
          page.items,
          localLandingPagesConfig
        );
        const pageCategories = allPageItems.categories;
        const pageSubjects = allPageItems.subjects;
        const pageProductFamilyItems = allPageItems.productFamilyItems;
        if (pageCategories.length > 0) {
          await AppDataSource.manager.save(Category, pageCategories);
          dbLandingPage.categories = pageCategories;
        } else if (pageSubjects.length > 0) {
          await AppDataSource.manager.save(Subject, pageSubjects);
          dbLandingPage.subjects = pageSubjects;
        } else if (pageProductFamilyItems.length > 0) {
          await AppDataSource.manager.save(
            ProductFamilyItem,
            pageProductFamilyItems
          );
          dbLandingPage.productFamilyItems = pageProductFamilyItems;
        }
      }
      const legacyPageSelector = page.selector;
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
          pageSelectorItems.push(pageSelectorItemWithRefs);
        }
        // Create an item for the currently selected item
        const currentlySelectedPageSelectorItem = new PageSelectorItem();
        currentlySelectedPageSelectorItem.label =
          legacyPageSelector.selectedItem;
        currentlySelectedPageSelectorItem.link = '#';
        pageSelectorItems.push(currentlySelectedPageSelectorItem);
        await AppDataSource.manager.save(PageSelectorItem, pageSelectorItems);
        pageSelector.pageSelectorItems = pageSelectorItems;
        await AppDataSource.manager.save(PageSelector, pageSelector);
        dbLandingPage.pageSelector = pageSelector;
      }
      const legacySearchFilters = page.search_filters;
      if (legacySearchFilters) {
        dbLandingPage.searchFilters = legacySearchFilters;
      }
      // Temporary sidebar for testing
      if (page.path.endsWith('cloudProducts/elysian')) {
        const sidebarItemDoc = new SidebarItem();
        const docResponse = await getEntity(Doc.name, {
          id: 'amstcccounterfraud',
        });
        sidebarItemDoc.label = 'Counter Fraud ClaimCenter';
        sidebarItemDoc.doc = docResponse.body;

        const testPageConfig = new Page();
        testPageConfig.path = "cloudProducts/elysian";
        testPageConfig.title = "Test Page Config";
        testPageConfig.component = "page";
        testPageConfig.isInProduction = false;
        const createdPage = await createOrUpdateEntity(Page.name, testPageConfig);
        const sidebarItemPage = new SidebarItem();
        sidebarItemPage.label = 'API References';
        sidebarItemPage.page = createdPage.body; 

        const sidebarItemLink = new SidebarItem();
        sidebarItemLink.link = '/alive';
        sidebarItemLink.label = 'Alive';

        await AppDataSource.manager.save(SidebarItem, [
          sidebarItemDoc,
          sidebarItemPage,
          sidebarItemLink,
        ]);
        const sidebar = new Sidebar();
        sidebar.label = 'Implementation resources';
        sidebar.sidebarItems = [
          sidebarItemDoc,
          sidebarItemPage,
          sidebarItemLink,
        ];
        await AppDataSource.manager.save(Sidebar, sidebar);
        dbLandingPage.sidebar = sidebar;
      }
      dbPageConfigs.push(dbLandingPage);
    }
    const saveResult = await AppDataSource.manager.save(Page, dbPageConfigs);
    return {
      status: 200,
      body: saveResult,
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

export async function putSourceConfigsInDatabase(): Promise<{
  status: integer;
  body: any;
}> {
  try {
    const localSourcesConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/sources`
    );

    const localSourcesConfig = readLocalSourceConfigs(localSourcesConfigDir);
    const updatedLocalConfig = [];
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

      updatedLocalConfig.push(dbSource);
    }
    const saveResult = await AppDataSource.manager.save(
      Source,
      updatedLocalConfig
    );
    return {
      status: 200,
      body: saveResult,
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
    const { status, body } = await getEntity(repoName, {
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
    const productName = await getEntity(ProductName.name, {
      name: productConfig.productName,
    });
    const platformName = await getEntity(ProductPlatform.name, {
      name: productConfig.platformName,
    });
    const versionName = await getEntity(ProductVersion.name, {
      name: productConfig.versionName,
    });
    const productEntity = await AppDataSource.manager.save(Product, {
      name: productName.body,
      platform: platformName.body,
      version: versionName.body,
    });
    dbDocProducts.push(productEntity);
  }
  return dbDocProducts;
}

async function addDocBuild(buildConfig: legacyBuildConfig) {
  const docBuild = new Build();
  const matchingBuildSrc = await getEntity(Source.name, {
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
  await AppDataSource.manager.save(Build, docBuild);
  return docBuild;
}

export async function putDocConfigsInDatabase(): Promise<{
  status: integer;
  body: any;
}> {
  try {
    const localDocsConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/docs`
    );
    const localBuildsConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/builds`
    );

    const localDocsConfig = readLocalDocConfigs(localDocsConfigDir);
    const localBuildsConfig = readLocalBuildConfigs(localBuildsConfigDir);
    const updatedLocalConfig = [];
    for await (const doc of localDocsConfig) {
      const dbDoc = new Doc();
      dbDoc.id = doc.id;
      dbDoc.url = doc.url;
      dbDoc.title = doc.title;
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

      updatedLocalConfig.push(dbDoc);
    }

    const saveResult = await AppDataSource.manager.save(
      Doc,
      updatedLocalConfig
    );
    return {
      status: 200,
      body: saveResult,
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
