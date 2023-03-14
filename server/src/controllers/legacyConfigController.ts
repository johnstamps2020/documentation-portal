import {
  createOrUpdateEntity,
  findAllEntities,
  findEntity,
} from './configController';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { Resource } from '../model/entity/Resource';
import { Source } from '../model/entity/Source';
import { join, resolve } from 'path';
import {
  legacyBuildConfig,
  legacyBuildsConfigFile,
  legacyDocConfig,
  legacyDocsConfigFile,
  legacyPageConfig,
  legacySourceConfig,
  legacySourcesConfigFile,
  Metadata,
} from '../types/legacyConfig';
import { Build, BuildType } from '../model/entity/Build';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { Page } from '../model/entity/Page';
import { getConfigFile, listItems } from './s3Controller';
import { runningInDevMode } from './utils/serverUtils';
import { Subject } from '../model/entity/Subject';
import { Response } from 'express';

export async function getLegacyDocConfigs(res: Response) {
  const { status, body } = await findAllEntities(Doc.name);
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
      legacyDoc.metadata.product = doc.products.map((p: Product) => p.name);
      legacyDoc.metadata.platform = doc.products.map(
        (p: Product) => p.platform
      );
      legacyDoc.metadata.version = doc.products.map((p: Product) => p.version);
      legacyDoc.metadata.release = doc.releases
        ? doc.releases.map((r: Release) => r.name)
        : null;
      const docSubjects = doc.subjects.map((s) => s.name);
      legacyDoc.metadata.subject = docSubjects.length > 0 ? docSubjects : null;

      legacyDocs.push(legacyDoc);
    }
  }
  return {
    status: 200,
    body: legacyDocs,
  };
}

export async function getLegacyBuildConfigs(res: Response) {
  const { status, body } = await findAllEntities(Doc.name);
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

export async function getLegacySourceConfigs(res: Response) {
  const { status, body } = await findAllEntities(Source.name);
  const legacySources = [];
  if (status === 200) {
    for (const src of body) {
      const legacySource = new legacySourceConfig();
      legacySource.id = src.id;
      legacySource.title = src.name;
      legacySource.gitUrl = src.gitUrl;
      legacySource.branch = src.gitBranch;
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
    'cloudProducts/garmisch': 'garmischBackground',
  };
  let background = null;
  Object.entries(backgroundPathMapping).forEach(([k, v]) => {
    if (k === pagePath) {
      background = v;
    }
  });
  return background;
}

function getCompletePageComponent(
  legacyPageConfig: legacyPageConfig,
  dbPageConfig: Page
) {
  const categoryLayout2Paths = [
    'cloudProducts/flaine',
    'cloudProducts/garmisch',
  ];
  const legacyPageConfigTemplate = legacyPageConfig.template;
  if (legacyPageConfigTemplate === 'redirect') {
    const redirectLink = legacyPageConfig
      .items!.find((i) => i.label === '_redirect')!
      .link!.replace(/^\/+/, '');
    return `${legacyPageConfigTemplate} ${redirectLink}`;
  }
  const pageComponent = categoryLayout2Paths.includes(dbPageConfig.path)
    ? 'pageCategory2'
    : null;
  const bgComponent = getBackgroundComponent(dbPageConfig.path);
  if (bgComponent) {
    if (pageComponent) {
      return `${bgComponent} ${pageComponent}`;
    }
    return bgComponent;
  }

  return pageComponent;
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
        path: 'internal',
        component: 'page',
        title: 'Internal',
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
        `${__dirname}/../legacyConfig/pages`
      );
      const getLegacyLandingPagesObjectsResult = await listItems(
        'legacy-landing-pages'
      );
      const legacyLandingPages =
        getLegacyLandingPagesObjectsResult.Contents?.map((i) => i.Key);
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
    const dbPageConfigs = [];
    const failedDbPageConfigs = [];
    for (const page of localLandingPagesConfig) {
      const dbPageConfig = new Page();
      const legacyPageAbsPath = page.path;
      dbPageConfig.path = getRelativePagePath(legacyPageAbsPath);
      dbPageConfig.title = page.title;
      dbPageConfig.component = getCompletePageComponent(page, dbPageConfig);
      dbPageConfig.isInProduction = false;
      const legacySearchFilters = page.search_filters;
      if (legacySearchFilters) {
        dbPageConfig.searchFilters = legacySearchFilters;
      }
      const result = await createOrUpdateEntity(Page.name, dbPageConfig);
      if (result.status === 200) {
        dbPageConfigs.push(result.body);
      } else {
        failedDbPageConfigs.push(result.body);
      }
    }
    if (failedDbPageConfigs.length > 0) {
      return {
        status: 206,
        body: {
          message: 'Unable to load some of the pages to the database',
          failureDetails: failedDbPageConfigs,
          loadedSourceConfigs: dbPageConfigs,
        },
      };
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
            message: `Cannot put source config in DB: Problem getting the source config file from S3 (${getSourcesConfigResult})`,
          },
        };
      }
    }

    const localSourcesConfig = readLocalSourceConfigs(localSourcesConfigDir);
    const dbSourceConfigs = [];
    const failedDbSourceConfigs = [];
    for await (const source of localSourcesConfig) {
      const dbSource = new Source();
      dbSource.id = source.id;
      dbSource.name = source.title;
      dbSource.gitUrl = source.gitUrl;
      dbSource.gitBranch = source.branch;

      const result = await createOrUpdateEntity(Source.name, dbSource);
      if (result.status === 200) {
        dbSourceConfigs.push(result.body);
      } else {
        failedDbSourceConfigs.push(result.body);
      }
    }
    if (failedDbSourceConfigs.length > 0) {
      return {
        status: 206,
        body: {
          message: 'Unable to load some of the sources to the database',
          failureDetails: failedDbSourceConfigs,
          loadedSourceConfigs: dbSourceConfigs,
        },
      };
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
    const { status, body } = await findEntity(
      repoName,
      {
        [mainKey]: i,
      },
      false
    );
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
    const productEntitySaveResult = await createOrUpdateEntity(Product.name, {
      name: productConfig.productName,
      platform: productConfig.platformName,
      version: productConfig.versionName,
    });
    dbDocProducts.push(productEntitySaveResult.body);
  }
  return dbDocProducts;
}

async function addDocBuild(buildConfig: legacyBuildConfig) {
  const docBuild = new Build();
  const matchingBuildSrc = await findEntity(
    Source.name,
    {
      id: buildConfig.srcId,
    },
    false
  );
  docBuild.id = `${buildConfig.srcId}${buildConfig.docId}`;
  const t = Object.entries(BuildType).find(
    ([k, v]) => v === buildConfig.buildType
  );
  docBuild.type = Array.isArray(t) ? t[1] : BuildType.DITA;
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
  const buildResources = buildConfig.resources;
  if (buildResources?.length > 0) {
    const docBuildResources = [];
    for (const resource of buildResources) {
      const docBuildResource = new Resource();
      docBuildResource.id = `${resource.sourceFolder}${resource.targetFolder}${resource.srcId}`;
      docBuildResource.sourceFolder = resource.sourceFolder;
      docBuildResource.targetFolder = resource.targetFolder;
      const sourceEntity = await findEntity(
        Source.name,
        { id: resource.srcId },
        false
      );
      docBuildResource.source = sourceEntity.body;
      const docBuildResourceSaveResult = await createOrUpdateEntity(
        Resource.name,
        docBuildResource
      );
      if (docBuildResourceSaveResult.status === 200) {
        docBuildResources.push(docBuildResourceSaveResult.body);
      }
      docBuild.resources = docBuildResources;
    }
  }
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
    const failedDbDocConfigs = [];
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
      if (docReleases.length > 0) {
        dbDoc.releases = docReleases;
      }

      // Find subjects and create if needed
      let docSubjects = [];
      const legacyDocSubjects = doc.metadata.subject;
      if (legacyDocSubjects) {
        docSubjects = await getOrCreateEntities(
          legacyDocSubjects,
          Subject.name,
          'name'
        );
      }
      if (docSubjects.length > 0) {
        dbDoc.subjects = docSubjects;
      }

      // Find products and create if needed
      const legacyDocProducts = doc.metadata.product;
      const legacyDocPlatforms = doc.metadata.platform;
      const legacyDocVersions = doc.metadata.version;
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

      const matchingBuild = localBuildsConfig.find((b) => b.docId === doc.id);
      if (matchingBuild) {
        dbDoc.build = await addDocBuild(matchingBuild);
      }

      const result = await createOrUpdateEntity(Doc.name, dbDoc);
      if (result.status === 200) {
        dbDocConfigs.push(result.body);
      } else {
        failedDbDocConfigs.push(result.body);
      }
    }
    if (failedDbDocConfigs.length > 0) {
      return {
        status: 206,
        body: {
          message: 'Unable to load some of the docs to the database',
          failureDetails: failedDbDocConfigs,
          loadedSourceConfigs: dbDocConfigs,
        },
      };
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
