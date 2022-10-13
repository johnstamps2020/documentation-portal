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
import { join, resolve } from 'path';
import { AppDataSource } from '../model/connection';
import {
  Environment,
  legacyBuildConfig,
  legacyBuildsConfigFile,
  legacyDocConfig,
  legacyDocsConfigFile,
  legacySourceConfig,
  legacySourcesConfigFile,
  Metadata,
} from '../types/legacyConfig';
import { Build } from '../model/entity/Build';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { ProductName } from '../model/entity/ProductName';
import { ProductPlatform } from '../model/entity/ProductPlatform';
import { ProductVersion } from '../model/entity/ProductVersion';

export async function getLegacyDocConfigs() {
  const { status, body } = await getAllEntities(Doc.name);
  const legacyDocs = [];
  if (status === 200) {
    for (const doc of body) {
      const legacyDoc = new legacyDocConfig();
      legacyDoc.id = doc.id;
      legacyDoc.title = doc.title;
      legacyDoc.url = doc.url;
      legacyDoc.body = doc.body;
      legacyDoc.environments = doc.environments;
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
      legacyDoc.metadata.release = doc.releases.map((r: Release) => r.name);
      legacyDoc.metadata.subject = doc.subjects;

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

export function readLocalDocConfigs(
  dirPath: string,
  deployEnv: Environment
): legacyDocConfig[] {
  try {
    const localConfig: legacyDocConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readLocalDocConfigs(itemPath, deployEnv));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: legacyDocsConfigFile = JSON.parse(config);
        const docs = json.docs.filter(d => d.environments.includes(deployEnv));
        localConfig.push(...docs);
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

export async function putSourceConfigsInDatabase(): Promise<{
  status: integer;
  body: any;
}> {
  try {
    const deployEnv =
      process.env.DEPLOY_ENV === 'omega2-andromeda'
        ? 'prod'
        : process.env.DEPLOY_ENV;
    console.log(`Getting local config for the "${deployEnv}" environment`);

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
    const deployEnv =
      process.env.DEPLOY_ENV === 'omega2-andromeda'
        ? 'prod'
        : process.env.DEPLOY_ENV;
    console.log(`Getting local config for the "${deployEnv}" environment`);

    const selectedEnv = deployEnv as Environment;

    const localDocsConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/docs`
    );
    const localBuildsConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/builds`
    );

    const localDocsConfig = readLocalDocConfigs(
      localDocsConfigDir,
      selectedEnv
    );
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
      dbDoc.environments = doc.environments;
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
