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
  LegacySourceConfig,
  LegacySourcesConfigFile,
  PlatformProductVersionCombination,
} from '../types/legacyConfig';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { getConfigFile } from './s3Controller';
import { runningInDevMode } from './utils/serverUtils';
import { Subject } from '../model/entity/Subject';
import { Request } from 'express';
import { ApiResponse } from '../types/apiResponse';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { Product } from '../model/entity/Product';
import { Platform } from '../model/entity/Platform';
import { Version } from '../model/entity/Version';
import { Language } from '../model/entity/Language';
import { DitaBuild } from '../model/entity/DitaBuild';
import { YarnBuild } from '../model/entity/YarnBuild';
import { SourceZipBuild } from '../model/entity/SourceZipBuild';
import { JustCopyBuild } from '../model/entity/JustCopyBuild';
import { AppDataSource } from '../model/connection';

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
        language: doc.language.code,
        product: doc.platformProductVersions.map((ppv) => ppv.product.name),
        platform: removeDuplicatesAndEmptyValues(
          doc.platformProductVersions.map((ppv) => ppv.platform.name)
        ),
        version: removeDuplicatesAndEmptyValues(
          doc.platformProductVersions.map((ppv) => ppv.version.name)
        ),
      },
    };
    const docDisplayTitle = doc.displayTitle;
    if (docDisplayTitle) {
      legacyDoc.displayTitle = docDisplayTitle;
    }

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

async function addUuidIfEntityExists(
  entityName: string,
  where: FindOptionsWhere<ObjectLiteral>,
  entityInstance: ObjectLiteral,
  loadRelations: boolean = false
): Promise<ObjectLiteral> {
  try {
    const dbEntityInstance = await findEntity(entityName, where, loadRelations);
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
  if (configType === 'doc') {
    return await putDocConfigsInDatabase();
  } else if (configType === 'source') {
    return await putSourceConfigsInDatabase();
  } else if (configType === 'build') {
    return await putBuildConfigsInDatabase();
  }
  return {
    status: 500,
    body: { message: 'Operation failed: cannot put configs in the database' },
  };
}

type ConfigType = 'doc' | 'source' | 'build';

type ConfigTypeParams = {
  localConfigPath: string;
  localS3ConfigPath: string;
  localS3ConfigFileName: string;
  remoteS3ConfigPath: string;
  readLocalConfigFunc: (
    path: string
  ) => LegacyDocConfig[] | LegacySourceConfig[] | LegacyBuildConfig[];
  dbEntities: ObjectLiteral[];
};

type ConfigTypeParamMap = {
  [key in ConfigType]: ConfigTypeParams;
};

const configTypeParamMap: ConfigTypeParamMap = {
  doc: {
    localConfigPath: `${__dirname}/../../../../documentation-portal-config/.teamcity/config/docs`,
    localS3ConfigPath: `${__dirname}/../legacyConfig/docs`,
    localS3ConfigFileName: 'docs.json',
    remoteS3ConfigPath: 'legacy-config/docs.json',
    readLocalConfigFunc: readLocalDocConfigs,
    dbEntities: [Doc],
  },
  source: {
    localConfigPath: `${__dirname}/../../../../documentation-portal-config/.teamcity/config/sources`,
    localS3ConfigPath: `${__dirname}/../legacyConfig/sources`,
    localS3ConfigFileName: 'legacy-config/sources.json',
    remoteS3ConfigPath: 'sources.json',
    readLocalConfigFunc: readLocalSourceConfigs,
    dbEntities: [Source],
  },
  build: {
    localConfigPath: `${__dirname}/../../../../documentation-portal-config/.teamcity/config/builds`,
    localS3ConfigPath: `${__dirname}/../legacyConfig/builds`,
    localS3ConfigFileName: 'builds.json',
    remoteS3ConfigPath: 'legacy-config/builds.json',
    readLocalConfigFunc: readLocalBuildConfigs,
    dbEntities: [DitaBuild, YarnBuild, JustCopyBuild, SourceZipBuild],
  },
};

async function getConfigs(
  configType: ConfigType
): Promise<LegacyDocConfig[] | LegacySourceConfig[] | LegacyBuildConfig[]> {
  const isDevMode = runningInDevMode();
  const configParamsItem: ConfigTypeParams = configTypeParamMap[configType];
  const configParamsItemFunc = configParamsItem.readLocalConfigFunc;
  if (isDevMode) {
    return configParamsItemFunc(resolve(configParamsItem.localConfigPath));
  }
  const getDocsConfigResult = await getConfigFile(
    resolve(configParamsItem.localS3ConfigPath),
    configParamsItem.localS3ConfigFileName,
    configParamsItem.remoteS3ConfigPath
  );
  if (getDocsConfigResult !== 'success') {
    return [];
  }
  return configParamsItemFunc(resolve(configParamsItem.localS3ConfigPath));
}

async function putSourceConfigsInDatabase(): Promise<ApiResponse> {
  try {
    const localSourcesConfig = (await getConfigs(
      'source'
    )) as LegacySourceConfig[];
    if (localSourcesConfig.length === 0) {
      return {
        status: 500,
        body: {
          message: `Unable to get source configs from S3`,
        },
      };
    }
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

async function updateIsInProductionPropertyInEntities(
  entityName:
    | 'PlatformProductVersion'
    | 'Release'
    | 'Subject'
    | 'Product'
    | 'Version'
    | 'Language',
  relatedEntityName: 'Doc' | 'PlatformProductVersion',
  relationName:
    | 'platformProductVersions'
    | 'releases'
    | 'subjects'
    | 'product'
    | 'version'
    | 'language'
) {
  const updatedEntities = [];
  const allEntities = await findAllEntities(entityName, true);

  if (!allEntities) {
    return;
  }

  for (const entity of allEntities) {
    const relatedProdEntity = await findEntity(
      relatedEntityName,
      {
        isInProduction: true,
        [relationName]: {
          uuid: entity.uuid,
        },
      },
      true
    );
    entity.isInProduction = !!relatedProdEntity;
    updatedEntities.push(entity);
  }
  await saveEntities(updatedEntities);
}

async function updateNonProdPlatformProductVersionEntities() {
  // These three functions have to be run in this order
  await updateIsInProductionPropertyInEntities(
    'PlatformProductVersion',
    'Doc',
    'platformProductVersions'
  );
  await updateIsInProductionPropertyInEntities(
    'Product',
    'PlatformProductVersion',
    'product'
  );
  await updateIsInProductionPropertyInEntities(
    'Version',
    'PlatformProductVersion',
    'version'
  );
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

async function createLanguageEntities(legacyDocConfig: LegacyDocConfig[]) {
  const languages: { [key: string]: string } = {
    de: 'German (Germany)',
    en: 'English (United States)',
    el: 'Greek (Greece)',
    es: 'Spanish (Latin America and Caribbean region)',
    'es-ES': 'Spanish (Spain)',
    fr: 'French (France)',
    it: 'Italian (Italy)',
    ja: 'Japanese (Japan)',
    nl: 'Dutch (Netherlands)',
    pt: 'Portuguese (Brazil)',
  };
  const dbDocLanguagesToSave: Language[] = [];
  for (const doc of legacyDocConfig) {
    const legacyDocLanguage = doc.metadata.language;
    if (
      legacyDocLanguage &&
      !dbDocLanguagesToSave.find(
        (dbDocLanguageToSave) => dbDocLanguageToSave.code === legacyDocLanguage
      )
    ) {
      const dbDocLanguage = new Language();
      dbDocLanguage.code = legacyDocLanguage;
      dbDocLanguage.label = languages[legacyDocLanguage];
      const dbDocLanguageToSave = await addUuidIfEntityExists(
        Language.name,
        { code: dbDocLanguage.code },
        dbDocLanguage
      );
      dbDocLanguagesToSave.push(dbDocLanguageToSave as Language);
    }
  }
  await saveEntities(dbDocLanguagesToSave);
}

async function addDocLanguage(legacyDoc: LegacyDocConfig): Promise<Language> {
  const dbDocLanguage = await findEntity(
    Language.name,
    { code: legacyDoc.metadata.language },
    false
  );
  return dbDocLanguage as Language;
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
        `${__dirname}/../../../../documentation-portal-config/.teamcity/config/docs`
      );
      console.log(localDocsConfigDir);
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
    await createLanguageEntities(localDocsConfig);
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
        dbDoc.displayTitle = doc.displayTitle || null;
        dbDoc.public = doc.public;
        dbDoc.ignorePublicPropertyAndUseVariants =
          doc.ignorePublicPropertyAndUseVariants || null;
        dbDoc.internal = doc.internal;
        dbDoc.earlyAccess = doc.earlyAccess;
        dbDoc.displayOnLandingPages = doc.displayOnLandingPages;
        dbDoc.indexForSearch = doc.indexForSearch;
        dbDoc.isInProduction = doc.environments.includes('prod');
        dbDoc.body = doc.body || null;

        dbDoc.language = await addDocLanguage(doc);
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
    await Promise.all([
      updateNonProdPlatformProductVersionEntities(),
      updateIsInProductionPropertyInEntities('Release', 'Doc', 'releases'),
      updateIsInProductionPropertyInEntities('Subject', 'Doc', 'subjects'),
      updateIsInProductionPropertyInEntities('Language', 'Doc', 'language'),
    ]);
    return {
      status: 200,
      body: {
        successfullySavedToDb: dbDocConfigsSaveResult,
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
        `${__dirname}/../../../../documentation-portal-config/.teamcity/config/builds`
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
          {
            doc: {
              id: build.docId,
            },
          },
          dbBuild,
          true
        );
        dbBuildConfigsToSave.push(dbBuildConfigToSave);
      }
    }
    const dbBuildConfigsSaveResult = await saveEntities(dbBuildConfigsToSave);
    return {
      status: 200,
      body: {
        successfullySavedToDb: dbBuildConfigsSaveResult,
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

async function deleteObsoleteConfigsFromDb(
  configType: ConfigType
): Promise<ApiResponse> {
  try {
    const legacyConfigs = await getConfigs(configType);
    if (legacyConfigs.length === 0) {
      return {
        status: 500,
        body: {
          message: `Unable to get configs for ${configType}`,
          numberOfEntitiesDeletedFromDb: 0,
        },
      };
    }
    const allDbEntities: ObjectLiteral[] = [];
    for (const entity of configTypeParamMap[configType].dbEntities) {
      const dbEntities = await findAllEntities(entity.name, false);
      if (dbEntities) {
        allDbEntities.push(...dbEntities);
      }
    }
    const dbEntitiesNotInConfigs: ObjectLiteral[] = allDbEntities.filter(
      (dbEntity) => {
        return !legacyConfigs.some((config) => {
          if (configType === 'build') {
            return (
              `${(config as LegacyBuildConfig).srcId}${
                (config as LegacyBuildConfig).docId
              }` === dbEntity.id
            );
          }
          return (
            (config as LegacyDocConfig | LegacySourceConfig).id === dbEntity.id
          );
        });
      }
    );

    if (dbEntitiesNotInConfigs.length === 0) {
      return {
        status: 404,
        body: {
          message: `No entities to delete from the database for "${configType}"`,
          numberOfEntitiesDeletedFromDb: 0,
        },
      };
    }

    let dbEntityDeleteCount = 0;
    for (const entity of configTypeParamMap[configType].dbEntities) {
      const dbEntityDeleteResult = await AppDataSource.manager.delete(
        entity.name,
        dbEntitiesNotInConfigs
      );
      dbEntityDeleteCount += dbEntityDeleteResult.affected || 0;
    }

    return {
      status: 200,
      body: {
        numberOfEntitiesDeletedFromDb: dbEntityDeleteCount,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Cannot delete entities for "${configType}" from the database: ${err}`,
        numberOfEntitiesDeletedFromDb: 0,
      },
    };
  }
}

export async function deleteObsoleteEntitiesFromDb(
  req: Request
): Promise<ApiResponse> {
  let deleteObsoleteEntitiesCompletedWithErrors = false;
  try {
    const deleteBuildConfigsResponse = await deleteObsoleteConfigsFromDb(
      'build'
    );
    const deleteSourceConfigsResponse = await deleteObsoleteConfigsFromDb(
      'source'
    );
    const deleteDocConfigsResponse = await deleteObsoleteConfigsFromDb('doc');
    if (
      [
        deleteBuildConfigsResponse,
        deleteSourceConfigsResponse,
        deleteDocConfigsResponse,
      ].some((response) => response.status === 500)
    ) {
      return {
        status: 500,
        body: {
          message:
            'Deleting obsolete entities from the database completed with errors',
        },
      };
    }

    return {
      status: 200,
      body: {
        numberOfBuildEntitiesDeletedFromDb:
          deleteBuildConfigsResponse.body.numberOfEntitiesDeletedFromDb,
        numberOfSourceEntitiesDeletedFromDb:
          deleteSourceConfigsResponse.body.numberOfEntitiesDeletedFromDb,
        numberOfDocEntitiesDeletedFromDb:
          deleteDocConfigsResponse.body.numberOfEntitiesDeletedFromDb,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Error deleting obsolete entities from the database: ${err}`,
      },
    };
  }
}
