import { findAllEntities, findEntity, saveEntities } from './configController';
import { Doc } from '../model/entity/Doc';
import { PlatformProductVersion } from '../model/entity/PlatformProductVersion';
import { Release } from '../model/entity/Release';
import { Resource } from '../model/entity/Resource';
import { Source } from '../model/entity/Source';
import { join, resolve } from 'path';
import {
  LegacyBuildConfig,
  LegacyBuildResource,
  LegacyBuildsConfigFile,
  LegacyDocConfig,
  LegacyDocsConfigFile,
  LegacyItem,
  LegacyPageConfig,
  LegacySourceConfig,
  LegacySourcesConfigFile,
  PlatformProductVersionCombination,
} from '../types/legacyConfig';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { Page } from '../model/entity/Page';
import { getConfigFile, listItems } from './s3Controller';
import { runningInDevMode } from './utils/serverUtils';
import { Subject } from '../model/entity/Subject';
import { Request } from 'express';
import { ApiResponse } from '../types/apiResponse';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { ExternalLink } from '../model/entity/ExternalLink';
import { Product } from '../model/entity/Product';
import { Platform } from '../model/entity/Platform';
import { Version } from '../model/entity/Version';
import { Locale } from '../model/entity/Locale';
import { DitaBuild } from '../model/entity/DitaBuild';
import { YarnBuild } from '../model/entity/YarnBuild';
import { SourceZipBuild } from '../model/entity/SourceZipBuild';
import { JustCopyBuild } from '../model/entity/JustCopyBuild';

export async function getLegacyConfigs(req: Request): Promise<ApiResponse> {
  const { configType } = req.params;
  const allowedConfigTypes = ['doc', 'source', 'build'];
  if (!allowedConfigTypes.includes(configType)) {
    return {
      status: 400,
      body: {
        message: `Incorrect configType parameter. Allowed values: ${allowedConfigTypes.join(
          ', '
        )}. For example: /entity/legacy/doc`,
      },
    };
  }
  let legacyConfigs:
    | LegacySourceConfig[]
    | LegacyDocConfig[]
    | LegacyBuildConfig[] = [];
  if (configType === 'source') {
    legacyConfigs = await getLegacySourceConfigs();
  } else if (configType === 'doc') {
    legacyConfigs = await getLegacyDocConfigs();
  } else if (configType === 'build') {
    legacyConfigs = await getLegacyBuildConfigs();
  }
  if (!legacyConfigs) {
    return {
      status: 404,
      body: {
        message: `Did not find entities of ${configType} type`,
      },
    };
  }
  return {
    status: 200,
    body: legacyConfigs,
  };
}

function removeDuplicatesAndEmptyValues(array: string[]) {
  return array
    .filter(Boolean)
    .filter((value, index) => array.indexOf(value) === index);
}

async function getLegacyDocConfigs(): Promise<LegacyDocConfig[]> {
  const dbDocs = (await findAllEntities(Doc.name)) as Doc[];
  const legacyDocs: LegacyDocConfig[] = [];
  for (const doc of dbDocs) {
    const legacyDoc: LegacyDocConfig = {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      environments: doc.isInProduction ? ['staging', 'prod'] : ['staging'],
      displayOnLandingPages: doc.displayOnLandingPages,
      indexForSearch: doc.indexForSearch,
      public: doc.public,
      internal: doc.internal,
      earlyAccess: doc.earlyAccess,
      metadata: {
        product: doc.platformProductVersions.map((ppv) => ppv.product.name),
        platform: removeDuplicatesAndEmptyValues(
          doc.platformProductVersions.map((ppv) => ppv.platform.name)
        ),
        version: removeDuplicatesAndEmptyValues(
          doc.platformProductVersions.map((ppv) => ppv.version.name)
        ),
        locale: removeDuplicatesAndEmptyValues(doc.locales.map((l) => l.code)),
      },
    };
    const docBody = doc.body;
    if (docBody) {
      legacyDoc.body = docBody;
    }
    // When an entity is saved and this relation is empty, it's set to "null".
    // However, the find option in typeorm returns an empty array instead of "null".
    const docReleases = doc.releases;
    if (docReleases && docReleases.length > 0) {
      legacyDoc.metadata.release = removeDuplicatesAndEmptyValues(
        docReleases.map((r) => r.name)
      );
    }
    // When an entity is saved and this relation is empty, it's set to "null".
    // However, the find option in typeorm returns an empty array instead of "null".
    const docSubjects = doc.subjects;
    if (docSubjects && docSubjects.length > 0) {
      legacyDoc.metadata.subject = removeDuplicatesAndEmptyValues(
        docSubjects.map((s) => s.name)
      );
    }

    legacyDocs.push(legacyDoc);
  }
  return legacyDocs;
}

function addResourcesToLegacyBuildConfig(
  dbBuild: DitaBuild | YarnBuild | JustCopyBuild | SourceZipBuild,
  legacyBuild: LegacyBuildConfig
): LegacyBuildConfig {
  const dbBuildResources = dbBuild.resources;
  // When an entity is saved and this relation is empty, it's set to "null".
  // However, the find option in typeorm returns an empty array instead of "null".
  if (dbBuildResources && dbBuildResources.length > 0) {
    legacyBuild.resources = dbBuildResources.map((rs) => {
      const legacyResource: LegacyBuildResource = {
        sourceFolder: rs.sourceFolder,
        targetFolder: rs.targetFolder,
        srcId: rs.source.id,
      };
      return legacyResource;
    });
  }
  return legacyBuild;
}

async function getLegacyBuildConfigs(): Promise<LegacyBuildConfig[]> {
  const ditaBuilds = (await findAllEntities(DitaBuild.name)) as DitaBuild[];
  const yarnBuilds = (await findAllEntities(YarnBuild.name)) as YarnBuild[];
  const justCopyBuilds = (await findAllEntities(
    JustCopyBuild.name
  )) as JustCopyBuild[];
  const sourceZipBuilds = (await findAllEntities(
    SourceZipBuild.name
  )) as SourceZipBuild[];

  const legacyBuilds: LegacyBuildConfig[] = [];

  for (const ditaBuild of ditaBuilds) {
    const legacyBuild: LegacyBuildConfig = {
      buildType: 'dita',
      srcId: ditaBuild.source.id,
      docId: ditaBuild.doc.id,
      disabled: ditaBuild.disabled,
      root: ditaBuild.root,
      indexRedirect: ditaBuild.indexRedirect,
    };
    const ditaBuildFilter = ditaBuild.filter;
    if (ditaBuildFilter) {
      legacyBuild.filter = ditaBuildFilter;
    }
    legacyBuilds.push(addResourcesToLegacyBuildConfig(ditaBuild, legacyBuild));
  }
  for (const yarnBuild of yarnBuilds) {
    const legacyBuild: LegacyBuildConfig = {
      buildType: 'yarn',
      srcId: yarnBuild.source.id,
      docId: yarnBuild.doc.id,
      disabled: yarnBuild.disabled,
    };
    const properties = [
      'customEnv',
      'yarnBuildCustomCommand',
      'workingDir',
      'outputPath',
      'nodeImageVersion',
    ];
    for (const property of properties) {
      if (yarnBuild[property as keyof YarnBuild]) {
        //@ts-ignore
        legacyBuild[property as keyof LegacyBuildConfig] =
          yarnBuild[property as keyof YarnBuild];
      }
    }
    legacyBuilds.push(addResourcesToLegacyBuildConfig(yarnBuild, legacyBuild));
  }
  for (const sourceZipBuild of sourceZipBuilds) {
    const legacyBuild: LegacyBuildConfig = {
      buildType: 'source-zip',
      srcId: sourceZipBuild.source.id,
      docId: sourceZipBuild.doc.id,
      disabled: sourceZipBuild.disabled,
      zipFilename: sourceZipBuild.zipFilename,
    };
    legacyBuilds.push(
      addResourcesToLegacyBuildConfig(sourceZipBuild, legacyBuild)
    );
  }
  for (const justCopyBuild of justCopyBuilds) {
    const legacyBuild: LegacyBuildConfig = {
      buildType: 'just-copy',
      srcId: justCopyBuild.source.id,
      docId: justCopyBuild.doc.id,
      disabled: justCopyBuild.disabled,
    };
    legacyBuilds.push(
      addResourcesToLegacyBuildConfig(justCopyBuild, legacyBuild)
    );
  }
  return legacyBuilds;
}

async function getLegacySourceConfigs(): Promise<LegacySourceConfig[]> {
  const dbSources = (await findAllEntities(Source.name)) as Source[];
  const legacySources: LegacySourceConfig[] = [];
  for (const src of dbSources) {
    const legacySource: LegacySourceConfig = {
      id: src.id,
      title: src.name,
      gitUrl: src.gitUrl,
      branch: src.gitBranch,
    };
    legacySources.push(legacySource);
  }
  return legacySources;
}

export function readLocalDocConfigs(dirPath: string): LegacyDocConfig[] {
  try {
    const localConfig: LegacyDocConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalDocConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: LegacyDocsConfigFile = JSON.parse(config);
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

export function readLocalBuildConfigs(dirPath: string): LegacyBuildConfig[] {
  try {
    const localConfig: LegacyBuildConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalBuildConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: LegacyBuildsConfigFile = JSON.parse(config);
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

export function readLocalSourceConfigs(dirPath: string): LegacySourceConfig[] {
  try {
    const localConfig: LegacySourceConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalSourceConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: LegacySourcesConfigFile = JSON.parse(config);
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

export function readLocalPageConfigs(dirPath: string): LegacyPageConfig[] {
  try {
    const localConfig: LegacyPageConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalPageConfigs(itemPath));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: LegacyPageConfig = JSON.parse(config);
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
    'cloudProducts/hakuba': 'hakubaBackground',
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
  legacyPageConfig: LegacyPageConfig,
  dbPageConfig: Page
): string | null {
  const categoryLayout2Paths = [
    'cloudProducts/flaine',
    'cloudProducts/garmisch',
    'cloudProducts/hakuba',
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

async function addUuidIfEntityExists(
  entityName: string,
  where: FindOptionsWhere<ObjectLiteral>,
  entityInstance: ObjectLiteral
): Promise<ObjectLiteral> {
  try {
    const dbEntityInstance = await findEntity(entityName, where, false);
    if (dbEntityInstance) {
      entityInstance.uuid = dbEntityInstance.uuid;
    }
    return entityInstance;
  } catch (err) {
    throw new Error(`Cannot get UUID for an existing entity: ${err}`);
  }
}

export async function putConfigsInDatabase(req: Request): Promise<ApiResponse> {
  const { configType } = req.params;
  const allowedConfigTypes = ['doc', 'source', 'page', 'build'];
  if (!allowedConfigTypes.includes(configType)) {
    return {
      status: 400,
      body: {
        message: `Incorrect configType parameter. Allowed values: ${allowedConfigTypes.join(
          ', '
        )}. For example: /entity/legacy/doc`,
      },
    };
  }
  if (configType === 'doc') {
    return await putDocConfigsInDatabase();
  } else if (configType === 'source') {
    return await putSourceConfigsInDatabase();
  } else if (configType === 'page') {
    return await putPageConfigsInDatabase();
  } else if (configType === 'build') {
    return await putBuildConfigsInDatabase();
  }
  return {
    status: 500,
    body: { message: 'Operation failed: cannot put configs in the database' },
  };
}

async function createExternalLinkEntities(
  pageItems: LegacyItem[]
): Promise<ApiResponse> {
  try {
    const dbExternalLinkConfigsToSave: ExternalLink[] = [];
    for (const pageItem of pageItems) {
      if (pageItem.items) {
        for (const innerItem of pageItem.items) {
          const externalLink = innerItem.link;
          if (externalLink) {
            if (
              !dbExternalLinkConfigsToSave.find(
                (dbExternalLinkConfigToSave) =>
                  dbExternalLinkConfigToSave.url === externalLink
              )
            ) {
              const dbExternalLinkConfig = new ExternalLink();
              dbExternalLinkConfig.url = externalLink;
              dbExternalLinkConfig.label = innerItem.label;
              dbExternalLinkConfig.public = false;
              dbExternalLinkConfig.isInProduction = false;
              dbExternalLinkConfig.earlyAccess = false;
              dbExternalLinkConfig.internal = false;

              const dbExternalLinkConfigToSave = await addUuidIfEntityExists(
                ExternalLink.name,
                { url: dbExternalLinkConfig.url },
                dbExternalLinkConfig
              );
              dbExternalLinkConfigsToSave.push(
                dbExternalLinkConfigToSave as ExternalLink
              );
            }
          }
        }
      }
    }
    const dbExternalLinkConfigsSaveResult = await saveEntities(
      dbExternalLinkConfigsToSave
    );
    return {
      status: 200,
      body: dbExternalLinkConfigsSaveResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot save ExternalLink entities to the database: ${err}`,
      },
    };
  }
}

async function putPageConfigsInDatabase(): Promise<ApiResponse> {
  try {
    const isDevMode = runningInDevMode();
    let localLandingPagesConfigDir: string;
    const failedFetchesFromS3 = [];
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
            legacyLandingPage!
          );
          if (getLegacyLandingPageConfigResult !== 'success') {
            failedFetchesFromS3.push(legacyLandingPage);
          }
        }
      }
    }

    const localLandingPagesConfig = readLocalPageConfigs(
      localLandingPagesConfigDir
    );
    const dbPageConfigsToSave: Page[] = [];
    for (const page of localLandingPagesConfig) {
      const relativePagePath = getRelativePagePath(page.path);
      if (
        !dbPageConfigsToSave.find(
          (dbPageConfigToSave) => dbPageConfigToSave.path === relativePagePath
        )
      ) {
      }
      const dbPageConfig = new Page();
      dbPageConfig.path = relativePagePath;
      dbPageConfig.title = page.title;
      dbPageConfig.component = getCompletePageComponent(page, dbPageConfig);
      dbPageConfig.isInProduction = false;
      dbPageConfig.internal = false;
      dbPageConfig.searchFilters = page.search_filters || null;
      await createExternalLinkEntities(page.items);
      const dbPageConfigToSave = await addUuidIfEntityExists(
        Page.name,
        { path: dbPageConfig.path },
        dbPageConfig
      );
      dbPageConfigsToSave.push(dbPageConfigToSave as Page);
    }
    const dbPageConfigsSaveResult = await saveEntities(dbPageConfigsToSave);
    return {
      status: 200,
      body: {
        successfullySavedToDb: dbPageConfigsSaveResult,
        failedToFetchFromS3: failedFetchesFromS3,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot save Page entities to the database: ${err}`,
      },
    };
  }
}

async function putSourceConfigsInDatabase(): Promise<ApiResponse> {
  try {
    const isDevMode = runningInDevMode();
    let localSourcesConfigDir: string;
    if (isDevMode) {
      localSourcesConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/sources`
      );
    } else {
      localSourcesConfigDir = resolve(`${__dirname}/../legacyConfig/sources`);
      const sourcesConfigS3Path = 'legacy-config/sources.json';
      const getSourcesConfigResult = await getConfigFile(
        localSourcesConfigDir,
        'sources.json',
        sourcesConfigS3Path
      );
      if (getSourcesConfigResult !== 'success') {
        return {
          status: 500,
          body: {
            message: `Unable to get ${sourcesConfigS3Path} from S3`,
          },
        };
      }
    }

    const localSourcesConfig = readLocalSourceConfigs(localSourcesConfigDir);
    const dbSourceConfigsToSave: Source[] = [];
    for await (const source of localSourcesConfig) {
      const sourceId = source.id;
      if (
        !dbSourceConfigsToSave.find(
          (dbSourceConfigToSave) => dbSourceConfigToSave.id === sourceId
        )
      ) {
        const dbSource = new Source();
        dbSource.id = source.id;
        dbSource.name = source.title;
        dbSource.gitUrl = source.gitUrl;
        dbSource.gitBranch = source.branch;
        const dbSourceConfigToSave = await addUuidIfEntityExists(
          Source.name,
          { id: dbSource.id },
          dbSource
        );
        dbSourceConfigsToSave.push(dbSourceConfigToSave as Source);
      }
    }
    const dbSourceConfigsSaveResult = await saveEntities(dbSourceConfigsToSave);
    return {
      status: 200,
      body: { successfullySavedToDb: dbSourceConfigsSaveResult },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot save Source entities to the database: ${err}`,
      },
    };
  }
}

function createLegacyPlatformProductVersionCombinations(
  legacyDocConfig: LegacyDocConfig
): PlatformProductVersionCombination[] {
  const legacyDocPlatforms = legacyDocConfig.metadata.platform;
  const legacyDocProducts = legacyDocConfig.metadata.product;
  const legacyDocVersions = legacyDocConfig.metadata.version;
  const legacyPlatformProductVersionCombinations = [];
  for (const product of legacyDocProducts) {
    for (const platform of legacyDocPlatforms) {
      for (const version of legacyDocVersions) {
        legacyPlatformProductVersionCombinations.push({
          productName: product,
          platformName: platform,
          versionName: version,
        });
      }
    }
  }
  return legacyPlatformProductVersionCombinations;
}

async function createPlatformProductVersionEntities(
  legacyDocConfig: LegacyDocConfig[]
) {
  const dbDocPlatformProductVersionsToSave: PlatformProductVersion[] = [];
  for (const doc of legacyDocConfig) {
    const platformProductVersionCombinations =
      createLegacyPlatformProductVersionCombinations(doc);
    for (const platformProductVersionCombination of platformProductVersionCombinations) {
      const dbPlatform = await findEntity(
        Platform.name,
        { name: platformProductVersionCombination.platformName },
        false
      );

      const dbProduct = await findEntity(
        Product.name,
        { name: platformProductVersionCombination.productName },
        false
      );

      const dbVersion = await findEntity(
        Version.name,
        { name: platformProductVersionCombination.versionName },
        false
      );
      const platformProductVersionExists =
        dbDocPlatformProductVersionsToSave.find(
          (ppv) =>
            ppv.platform.name === dbPlatform?.name &&
            ppv.product.name === dbProduct?.name &&
            ppv.version.name === dbVersion?.name
        );
      if (!platformProductVersionExists) {
        const dbPlatformProductVersion = new PlatformProductVersion();
        dbPlatformProductVersion.platform = dbPlatform as Platform;
        dbPlatformProductVersion.product = dbProduct as Product;
        dbPlatformProductVersion.version = dbVersion as Version;

        // Entity instances cannot be used in a find query.
        // If you try to do it, you get the following error: 'EntityPropertyNotFoundError: Property "constructor" was not found in <entityName>'.
        // Therefore, the spread syntax is used to convert Entity instances to Objects.
        const dbPlatformProductVersionToSave = await addUuidIfEntityExists(
          PlatformProductVersion.name,
          {
            platform: { ...dbPlatformProductVersion.platform },
            product: { ...dbPlatformProductVersion.product },
            version: { ...dbPlatformProductVersion.version },
          },
          dbPlatformProductVersion
        );
        dbDocPlatformProductVersionsToSave.push(
          dbPlatformProductVersionToSave as PlatformProductVersion
        );
      }
    }
  }
  await saveEntities(dbDocPlatformProductVersionsToSave);
}

async function createPlatformEntities(legacyDocConfig: LegacyDocConfig[]) {
  const dbDocPlatformsToSave: Platform[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocPlatforms = doc.metadata.platform;
    if (legacyDocPlatforms && legacyDocPlatforms.length > 0) {
      for (const legacyDocPlatform of legacyDocPlatforms) {
        if (
          !dbDocPlatformsToSave.find(
            (dbPlatformToSave) => dbPlatformToSave.name === legacyDocPlatform
          )
        ) {
          const dbDocPlatform = new Platform();
          dbDocPlatform.name = legacyDocPlatform;
          const dbDocPlatformToSave = await addUuidIfEntityExists(
            Platform.name,
            { name: dbDocPlatform.name },
            dbDocPlatform
          );
          dbDocPlatformsToSave.push(dbDocPlatformToSave as Platform);
        }
      }
    }
  }
  await saveEntities(dbDocPlatformsToSave);
}

async function createProductEntities(legacyDocConfig: LegacyDocConfig[]) {
  const dbDocProductsToSave: Product[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocProducts = doc.metadata.product;
    if (legacyDocProducts && legacyDocProducts.length > 0) {
      for (const legacyDocProduct of legacyDocProducts) {
        if (
          !dbDocProductsToSave.find(
            (dbProductToSave) => dbProductToSave.name === legacyDocProduct
          )
        ) {
          const dbDocProduct = new Product();
          dbDocProduct.name = legacyDocProduct;
          const dbDocProductToSave = await addUuidIfEntityExists(
            Product.name,
            { name: dbDocProduct.name },
            dbDocProduct
          );
          dbDocProductsToSave.push(dbDocProductToSave as Product);
        }
      }
    }
  }
  await saveEntities(dbDocProductsToSave);
}

async function createVersionEntities(legacyDocConfig: LegacyDocConfig[]) {
  const dbDocVersionsToSave: Version[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocVersions = doc.metadata.version;
    if (legacyDocVersions && legacyDocVersions.length > 0) {
      for (const legacyDocVersion of legacyDocVersions) {
        if (
          !dbDocVersionsToSave.find(
            (dbVersionToSave) => dbVersionToSave.name === legacyDocVersion
          )
        ) {
          const dbDocVersion = new Version();
          dbDocVersion.name = legacyDocVersion;
          const dbDocVersionToSave = await addUuidIfEntityExists(
            Version.name,
            { name: dbDocVersion.name },
            dbDocVersion
          );
          dbDocVersionsToSave.push(dbDocVersionToSave as Version);
        }
      }
    }
  }
  await saveEntities(dbDocVersionsToSave);
}

async function createReleaseEntities(legacyDocConfig: LegacyDocConfig[]) {
  const dbDocReleasesToSave: Release[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocReleases = doc.metadata.release;
    if (legacyDocReleases && legacyDocReleases.length > 0) {
      for (const legacyDocRelease of legacyDocReleases) {
        if (
          !dbDocReleasesToSave.find(
            (dbReleaseToSave) => dbReleaseToSave.name === legacyDocRelease
          )
        ) {
          const dbDocRelease = new Release();
          dbDocRelease.name = legacyDocRelease;
          const dbDocReleaseToSave = await addUuidIfEntityExists(
            Release.name,
            { name: dbDocRelease.name },
            dbDocRelease
          );
          dbDocReleasesToSave.push(dbDocReleaseToSave as Release);
        }
      }
    }
  }
  await saveEntities(dbDocReleasesToSave);
}

async function createSubjectEntities(legacyDocConfig: LegacyDocConfig[]) {
  const dbDocSubjectsToSave: Subject[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocSubjects = doc.metadata.subject;
    if (legacyDocSubjects && legacyDocSubjects.length > 0) {
      for (const legacyDocSubject of legacyDocSubjects) {
        if (
          !dbDocSubjectsToSave.find(
            (dbSubjectToSave) => dbSubjectToSave.name === legacyDocSubject
          )
        ) {
          const dbDocSubject = new Subject();
          dbDocSubject.name = legacyDocSubject;
          const dbDocSubjectToSave = await addUuidIfEntityExists(
            Subject.name,
            { name: dbDocSubject.name },
            dbDocSubject
          );
          dbDocSubjectsToSave.push(dbDocSubjectToSave as Subject);
        }
      }
    }
  }
  await saveEntities(dbDocSubjectsToSave);
}

async function createLocaleEntities(legacyDocConfig: LegacyDocConfig[]) {
  const locales: { [key: string]: string } = {
    'de-DE': 'German (Germany)',
    'en-US': 'English (United States)',
    'es-419': 'Spanish (Latin America and Caribbean region)',
    'es-ES': 'Spanish (Spain)',
    'fr-FR': 'French (France)',
    'it-IT': 'Italian (Italy)',
    'ja-JP': 'Japanese (Japan)',
    'nl-NL': 'Dutch (Netherlands)',
    'pt-BR': 'Portuguese (Brazil)',
  };
  const dbDocLocalesToSave: Locale[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocLocales = doc.metadata.locale;
    if (legacyDocLocales && legacyDocLocales.length > 0) {
      for (const legacyDocLocale of legacyDocLocales) {
        if (
          !dbDocLocalesToSave.find(
            (dbLocaleToSave) => dbLocaleToSave.code === legacyDocLocale
          )
        ) {
          const dbDocLocale = new Locale();
          dbDocLocale.code = legacyDocLocale;
          dbDocLocale.label = locales[legacyDocLocale];
          const dbDocLocaleToSave = await addUuidIfEntityExists(
            Locale.name,
            { code: dbDocLocale.code },
            dbDocLocale
          );
          dbDocLocalesToSave.push(dbDocLocaleToSave as Locale);
        }
      }
    }
  }
  await saveEntities(dbDocLocalesToSave);
}

async function addDocLocales(legacyDoc: LegacyDocConfig): Promise<Locale[]> {
  const legacyDocLocales = legacyDoc.metadata.locale;
  const docLocales: Locale[] = [];
  for (const legacyDocLocale of legacyDocLocales) {
    const dbDocLocale = await findEntity(
      Locale.name,
      { code: legacyDocLocale },
      false
    );
    docLocales.push(dbDocLocale as Locale);
  }
  return docLocales.filter(Boolean);
}

async function addDocReleases(
  legacyDoc: LegacyDocConfig
): Promise<Release[] | null> {
  const legacyDocReleases = legacyDoc.metadata.release;
  if (!legacyDocReleases || legacyDocReleases.length === 0) {
    return null;
  }
  const docReleases: Release[] = [];
  for (const legacyDocRelease of legacyDocReleases) {
    const dbDocRelease = await findEntity(
      Release.name,
      { name: legacyDocRelease },
      false
    );
    docReleases.push(dbDocRelease as Release);
  }
  return docReleases.filter(Boolean);
}

async function addDocSubjects(
  legacyDoc: LegacyDocConfig
): Promise<Subject[] | null> {
  const legacyDocSubjects = legacyDoc.metadata.subject;
  if (!legacyDocSubjects || legacyDocSubjects.length === 0) {
    return null;
  }
  const docSubjects: Subject[] = [];
  for (const legacyDocSubject of legacyDocSubjects) {
    const dbDocSubject = await findEntity(
      Subject.name,
      { name: legacyDocSubject },
      false
    );
    docSubjects.push(dbDocSubject as Subject);
  }
  return docSubjects.filter(Boolean);
}

async function addPlatformProductVersions(
  platformProductVersionCombinations: PlatformProductVersionCombination[]
): Promise<PlatformProductVersion[]> {
  const docPlatformProductVersions: PlatformProductVersion[] = [];
  for (const platformProductVersionCombination of platformProductVersionCombinations) {
    const dbPlatform = await findEntity(
      Platform.name,
      { name: platformProductVersionCombination.platformName },
      false
    );

    const dbProduct = await findEntity(
      Product.name,
      { name: platformProductVersionCombination.productName },
      false
    );

    const dbVersion = await findEntity(
      Version.name,
      { name: platformProductVersionCombination.versionName },
      false
    );

    // Entity instances cannot be used in a find query.
    // If you try to do it, you get the following error: 'EntityPropertyNotFoundError: Property "constructor" was not found in <entityName>'.
    // Therefore, the spread syntax is used to convert Entity instances to Objects.
    const dbDocPlatformProductVersion = await findEntity(
      PlatformProductVersion.name,
      {
        platform: { ...dbPlatform },
        product: { ...dbProduct },
        version: { ...dbVersion },
      },
      false
    );
    docPlatformProductVersions.push(
      dbDocPlatformProductVersion as PlatformProductVersion
    );
  }
  return docPlatformProductVersions.filter(Boolean);
}

async function putDocConfigsInDatabase(): Promise<ApiResponse> {
  try {
    const isDevMode = runningInDevMode();
    let localDocsConfigDir: string;
    if (isDevMode) {
      localDocsConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/docs`
      );
    } else {
      localDocsConfigDir = resolve(`${__dirname}/../legacyConfig/docs`);
      const docsConfigS3Path = 'legacy-config/docs.json';
      const getDocsConfigResult = await getConfigFile(
        localDocsConfigDir,
        'docs.json',
        docsConfigS3Path
      );
      if (getDocsConfigResult !== 'success') {
        return {
          status: 500,
          body: {
            message: `Unable to get ${docsConfigS3Path} from S3`,
          },
        };
      }
    }

    const localDocsConfig = readLocalDocConfigs(localDocsConfigDir);

    await createSubjectEntities(localDocsConfig);
    await createReleaseEntities(localDocsConfig);
    await createLocaleEntities(localDocsConfig);
    await createPlatformEntities(localDocsConfig);
    await createProductEntities(localDocsConfig);
    await createVersionEntities(localDocsConfig);
    await createPlatformProductVersionEntities(localDocsConfig);

    const dbDocConfigsToSave: Doc[] = [];
    for await (const doc of localDocsConfig) {
      const docId = doc.id;
      if (
        !dbDocConfigsToSave.find(
          (dbDocConfigToSave) => dbDocConfigToSave.id === docId
        )
      ) {
        const dbDoc = new Doc();
        dbDoc.id = docId;
        dbDoc.url = doc.url;
        dbDoc.title = doc.title;
        dbDoc.public = doc.public;
        dbDoc.internal = doc.internal;
        dbDoc.earlyAccess = doc.earlyAccess;
        dbDoc.displayOnLandingPages = doc.displayOnLandingPages;
        dbDoc.indexForSearch = doc.indexForSearch;
        dbDoc.isInProduction = doc.environments.includes('prod');
        dbDoc.body = doc.body || null;

        dbDoc.locales = await addDocLocales(doc);
        dbDoc.releases = await addDocReleases(doc);
        dbDoc.subjects = await addDocSubjects(doc);
        dbDoc.platformProductVersions = await addPlatformProductVersions(
          createLegacyPlatformProductVersionCombinations(doc)
        );

        const dbDocConfigToSave = await addUuidIfEntityExists(
          Doc.name,
          { id: dbDoc.id },
          dbDoc
        );
        dbDocConfigsToSave.push(dbDocConfigToSave as Doc);
      }
    }
    const dbDocConfigsSaveResult = await saveEntities(dbDocConfigsToSave);
    return {
      status: 200,
      body: {
        successfullySaved: dbDocConfigsSaveResult,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot save Doc entities to the database: ${err}`,
      },
    };
  }
}

function createBuildObject(
  legacyBuildConfig: LegacyBuildConfig
): DitaBuild | YarnBuild | SourceZipBuild | JustCopyBuild {
  switch (legacyBuildConfig.buildType) {
    case 'yarn':
      const yarnBuild = new YarnBuild();
      yarnBuild.nodeImageVersion = legacyBuildConfig.nodeImageVersion || null;
      yarnBuild.workingDir = legacyBuildConfig.workingDir || null;
      yarnBuild.yarnBuildCustomCommand =
        legacyBuildConfig.yarnBuildCustomCommand || null;
      yarnBuild.outputPath = legacyBuildConfig.outputPath || null;
      yarnBuild.customEnv = legacyBuildConfig.customEnv || null;
      return yarnBuild;
    case 'source-zip':
      const sourceZipBuild = new SourceZipBuild();
      sourceZipBuild.zipFilename =
        legacyBuildConfig.zipFilename || 'output.zip';
      return sourceZipBuild;
    case 'just-copy':
      return new JustCopyBuild();
    default:
      const ditaBuild = new DitaBuild();
      ditaBuild.root = legacyBuildConfig.root || '';
      ditaBuild.filter = legacyBuildConfig.filter || null;
      ditaBuild.indexRedirect = legacyBuildConfig.indexRedirect || true;
      return ditaBuild;
  }
}

async function putBuildConfigsInDatabase(): Promise<ApiResponse> {
  try {
    const isDevMode = runningInDevMode();
    let localBuildsConfigDir: string;
    if (isDevMode) {
      localBuildsConfigDir = resolve(
        `${__dirname}/../../../.teamcity/config/builds`
      );
    } else {
      localBuildsConfigDir = resolve(`${__dirname}/../legacyConfig/builds`);
      const buildsConfigS3Path = 'legacy-config/builds.json';
      const getBuildsConfigResult = await getConfigFile(
        localBuildsConfigDir,
        'builds.json',
        buildsConfigS3Path
      );
      if (getBuildsConfigResult !== 'success') {
        return {
          status: 500,
          body: {
            message: `Unable to get ${buildsConfigS3Path} from S3`,
          },
        };
      }
    }

    const localBuildsConfig = readLocalBuildConfigs(localBuildsConfigDir);
    const dbBuildConfigsToSave: any[] = [];
    for await (const build of localBuildsConfig) {
      const buildId = `${build.srcId}${build.docId}`;
      if (
        !dbBuildConfigsToSave.find(
          (dbBuildConfigToSave) => dbBuildConfigToSave.id === buildId
        )
      ) {
        const dbBuild = createBuildObject(build);
        dbBuild.id = `${build.srcId}${build.docId}`;
        dbBuild.disabled = build.disabled || false;
        dbBuild.source = (await findEntity(
          Source.name,
          { id: build.srcId },
          false
        )) as Source;
        dbBuild.doc = (await findEntity(
          Doc.name,
          { id: build.docId },
          false
        )) as Doc;
        const buildResources = build.resources;
        if (buildResources && buildResources?.length > 0) {
          const dbBuildResourcesToSave = [];
          for (const resource of buildResources) {
            const dbBuildResource = new Resource();
            dbBuildResource.id = `${resource.sourceFolder}${resource.targetFolder}${resource.srcId}`;
            dbBuildResource.sourceFolder = resource.sourceFolder;
            dbBuildResource.targetFolder = resource.targetFolder;
            const sourceEntity = await findEntity(
              Source.name,
              {
                id: resource.srcId,
              },
              false
            );
            dbBuildResource.source = sourceEntity as Source;
            const docBuildResourceToSave = await addUuidIfEntityExists(
              Resource.name,
              { id: dbBuildResource.id },
              dbBuildResource
            );
            dbBuildResourcesToSave.push(docBuildResourceToSave as Resource);
          }
          const dbBuildResourcesSaveResult = await saveEntities(
            dbBuildResourcesToSave
          );
          dbBuild.resources = dbBuildResourcesSaveResult as Resource[];
        }
        const dbBuildConfigToSave = await addUuidIfEntityExists(
          dbBuild.constructor.name,
          { id: dbBuild.id },
          dbBuild
        );
        dbBuildConfigsToSave.push(dbBuildConfigToSave);
      }
    }
    const dbBuildConfigsSaveResult = await saveEntities(dbBuildConfigsToSave);
    return {
      status: 200,
      body: {
        successfullySaved: dbBuildConfigsSaveResult,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot save Build entities to the database: ${err}`,
      },
    };
  }
}
