import fetch from 'node-fetch';
import { lstatSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { winstonLogger } from './loggerController';
import { ServerConfig } from '../types/config';
import { Request, Response } from 'express';
import { Environment } from '../types/environment';
import { VersionSelector } from '../model/entity/VersionSelector';
import { AppDataSource } from '../model/connection';
import { DocConfig } from '../model/entity/DocConfig';
import { Product } from '../model/entity/Product';
import { ProductName } from '../model/entity/ProductName';
import { ProductVersion } from '../model/entity/ProductVersion';
import { ProductPlatform } from '../model/entity/ProductPlatform';
import { Release } from '../model/entity/Release';
import { Build } from '../model/entity/Build';
import { Source } from '../model/entity/Source';
import { Resource } from '../model/entity/Resource';
import { integer } from '@elastic/elasticsearch/api/types';
import { FindOptionsWhere } from 'typeorm';

function optionsAreValid(options: {}) {
  return (
    options && Object.keys(options)?.length > 0 && !(options instanceof Array)
  );
}

export async function getEntity(
  req: Request
): Promise<{ status: integer; body: any }> {
  try {
    const { repo } = req.params;
    const options = req.query;
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Provide query parameters in the URL.',
        },
      };
    }
    const operationResult = await AppDataSource.manager.findOneBy(
      repo,
      options as {}
    );
    return {
      status: 200,
      body: operationResult ? operationResult : {},
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function createOrUpdateEntity(req: Request) {
  try {
    const { repo } = req.params;
    const options = req.body;
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Body cannot be empty or an array.',
        },
      };
    }
    const operationResult = await AppDataSource.manager.save(repo, options);
    return {
      status: 200,
      body: operationResult ? operationResult : {},
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function deleteEntity(req: Request) {
  try {
    const { repo } = req.params;
    const options = req.body;
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Body cannot be empty or an array.',
        },
      };
    }
    const operationResult = await AppDataSource.manager.delete(repo, options);
    return {
      status: 200,
      body: operationResult ? operationResult : {},
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

function readFilesInDir(dirPath: string, deployEnv: Environment): DocConfig[] {
  try {
    const localConfig: DocConfig[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readFilesInDir(itemPath, deployEnv));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: ServerConfig = JSON.parse(config);
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

export async function putConfigInDatabase(): Promise<{
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

    const localConfigDir = resolve(
      `${__dirname}/../../../.teamcity/config/docs`
    );

    const localConfig = readFilesInDir(localConfigDir, selectedEnv);

    // FIXME: Test data, remove after testing
    const BillingCenterName = new ProductName();
    BillingCenterName.name = 'BillingCenter';
    await AppDataSource.getRepository(ProductName).save(BillingCenterName);
    const BillingCenterVersion = new ProductVersion();
    BillingCenterVersion.name = '2022.05';
    await AppDataSource.getRepository(ProductVersion).save(
      BillingCenterVersion
    );
    const BillingCenterPlatform = new ProductPlatform();
    BillingCenterPlatform.name = 'Cloud';
    await AppDataSource.getRepository(ProductPlatform).save(
      BillingCenterPlatform
    );

    // FIXME: Test data, remove after testing
    const BillingCenterProduct = new Product();
    BillingCenterProduct.name = BillingCenterName;
    BillingCenterProduct.version = BillingCenterVersion;
    BillingCenterProduct.platform = BillingCenterPlatform;
    await AppDataSource.getRepository(Product).save(BillingCenterProduct);

    // FIXME: Test data, remove after testing
    const FlaineRelease = new Release();
    FlaineRelease.name = 'Flaine';
    const ElysianRelease = new Release();
    ElysianRelease.name = 'Elysian';
    await AppDataSource.getRepository(Release).save([
      ElysianRelease,
      FlaineRelease,
    ]);

    // FIXME: Test data, remove after testing
    const isSrc = new Source();
    isSrc.name = 'InsuranceSuite Source';
    isSrc.type = 'git';
    isSrc.gitUrl =
      'ssh://git@stash.guidewire.com/docsources/insurancesuite.git';
    isSrc.gitBranch = 'release/elysian';
    const isResourcesSrc = new Source();
    isResourcesSrc.name = 'InsuranceSuite Resources Source';
    isResourcesSrc.type = 'git';
    isResourcesSrc.gitUrl =
      'ssh://git@stash.guidewire.com/docsources/insurancesuite-resources.git';
    isResourcesSrc.gitBranch = 'release/elysian';
    await AppDataSource.getRepository(Source).save([isSrc, isResourcesSrc]);

    // FIXME: Test data, remove after testing
    const isResource1 = new Resource();
    isResource1.sourceFolder = 'resource1/src';
    isResource1.targetFolder = 'resource1/target';
    isResource1.source = isResourcesSrc;
    const isResource2 = new Resource();
    isResource2.sourceFolder = 'resource2/src';
    isResource2.targetFolder = 'resource2/target';
    isResource2.source = isResourcesSrc;
    await AppDataSource.getRepository(Resource).save([
      isResource1,
      isResource2,
    ]);

    let updatedLocalConfig: any[];
    updatedLocalConfig = [];
    for await (const doc of localConfig) {
      // console.log(
      //   `ABOUT TO SAVE DOC ${localConfig.indexOf(doc) + 1} of ${
      //     localConfig.length
      //   }`,
      //   doc
      // );

      // FIXME: Test data, remove after testing
      const docBuild = new Build();
      docBuild.type = 'dita';
      docBuild.source = isSrc;
      docBuild.filter = `${doc.id}.ditaval`;
      docBuild.root = 'main.ditamap';
      docBuild.indexRedirect = true;
      docBuild.resources = [isResource1, isResource2];
      await AppDataSource.getRepository(Build).save(docBuild);

      // FIXME: Test data, remove after testing
      const docConfig = new DocConfig();
      docConfig.id = doc.id;
      docConfig.url = doc.url;
      docConfig.title = doc.title;
      docConfig.internal = doc.internal;
      docConfig.earlyAccess = doc.earlyAccess;
      docConfig.displayOnLandingPages = doc.displayOnLandingPages;
      docConfig.environments = doc.environments;
      docConfig.indexForSearch = doc.indexForSearch;
      docConfig.releases = [ElysianRelease, FlaineRelease];
      docConfig.products = [BillingCenterProduct];
      docConfig.build = docBuild;

      updatedLocalConfig.push(docConfig);
    }

    const saveResult = await AppDataSource.manager.save(
      DocConfig,
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
        message: `Cannot put config in DB: ${(err as Error).message}`,
      },
    };
  }
}

export async function getConfig(
  reqObj: Request,
  resObj: Response
): Promise<DocConfig[]> {
  try {
    const options: FindOptionsWhere<DocConfig> = {};
    const isLoggedIn = reqObj.session?.requestIsAuthenticated;
    const hasGuidewireEmail = resObj.locals.userInfo?.hasGuidewireEmail;
    if (!isLoggedIn) {
      options.public = true;
    }
    if (!hasGuidewireEmail) {
      options.internal = false;
    }
    return await AppDataSource.getRepository(DocConfig).find({
      where: options,
    });
  } catch (err) {
    winstonLogger.error(
      `There was a problem with the getConfig() function
        ERROR: ${JSON.stringify(err)}`
    );
    return [];
  }
}

async function getDocByUrl(url: string) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const matchingDoc = await AppDataSource.getRepository(DocConfig).findOneBy({
    url: relativeUrl,
  });

  return matchingDoc;
}

export async function isPublicDoc(url: string) {
  try {
    const matchingDoc = await getDocByUrl(url);
    return !!(matchingDoc && matchingDoc.public);
  } catch (err) {
    winstonLogger.error(
      `Problem getting doc by url
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function isInternalDoc(url: string) {
  try {
    const matchingDoc = await getDocByUrl(url);
    return !!(matchingDoc && matchingDoc.internal);
  } catch (err) {
    winstonLogger.error(
      `Problem determining if doc is internal
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function getRootBreadcrumb(pagePathname: string) {
  try {
    const breadcrumbsConfigPath = new URL(
      `pages/breadcrumbs.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(breadcrumbsConfigPath);
    if (response.ok) {
      const breadcrumbsMapping = await response.json();
      try {
        for (const breadcrumb of breadcrumbsMapping) {
          if (
            pagePathname.startsWith(breadcrumb.docUrl) &&
            breadcrumb.rootPages.length === 1
          ) {
            return {
              rootPage: {
                path: breadcrumb.rootPages[0].path,
                label: breadcrumb.rootPages[0].label,
              },
            };
          }
        }
      } catch (breadErr) {
        throw new Error(
          `Problem getting breadcrumb file for page: "${pagePathname}" from file "${breadcrumbsConfigPath}": ${breadErr}`
        );
      }
    }
    return { rootPage: {} };
  } catch (err) {
    winstonLogger.error(
      `Something wrong when trying to get the root breadcrumb
          ERROR: ${JSON.stringify(err)}`
    );
    return { rootPage: {} };
  }
}

export async function getVersionSelector(
  docId: string,
  reqObj: Request,
  resObj: Response
) {
  try {
    const versionSelectorsConfigPath = new URL(
      `pages/versionSelectors.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(versionSelectorsConfigPath);
    if (response.ok) {
      const versionSelectorMapping: VersionSelector[] = await response.json();
      try {
        const matchingVersionSelector = versionSelectorMapping.find(
          s => docId === s.docId
        );
        // The getConfig function checks if the request is authenticated and if the user has the Guidewire email,
        // and filters the returned docs accordingly.
        // Therefore, for the selector it's enough to check if a particular version has a doc in the returned config.
        const docs = await getConfig(reqObj, resObj);
        if (matchingVersionSelector) {
          matchingVersionSelector[
            'allVersions'
          ] = matchingVersionSelector.allVersions.filter(v =>
            docs.find(d => d.url === v.url)
          );
          return { matchingVersionSelector: matchingVersionSelector };
        } else {
          return { matchingVersionSelector: {} };
        }
      } catch (verSelectorErr) {
        throw new Error(
          `Problem getting version selector for docId: ${docId}: ${verSelectorErr}`
        );
      }
    } else {
      return { matchingVersionSelector: {} };
    }
  } catch (err) {
    winstonLogger.error(
      `Holy Moly! Cannot get version selector!
          ERROR: ${JSON.stringify(err)}`
    );
    return { matchingVersionSelector: {} };
  }
}

export async function getDocumentMetadata(docId: string) {
  try {
    const doc = await AppDataSource.getRepository(DocConfig).findOneBy({
      id: docId,
    });
    if (doc) {
      return {
        docTitle: doc.title,
        docInternal: doc.internal,
        docEarlyAccess: doc.earlyAccess,
        docProducts: doc.products,
        docReleases: doc.releases,
      };
    } else {
      return {
        error: true,
        message: `Did not find a doc matching ID ${docId}`,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting document metadata
              docId: ${docId}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function getDocId(
  products: string,
  platforms: string,
  versions: string,
  title: string,
  url: string
) {
  try {
    const doc = await AppDataSource.manager.findOneBy(DocConfig, {
      url: url,
    });

    if (doc) {
      return {
        docId: doc.id,
      };
    } else {
      return {
        error: true,
        message: `Did not find a doc matching the provided info: ${products}, ${platforms}, ${versions}, ${title}, ${url}`,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting document id
              url: ${url}, 
              title: ${title},
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export function getEnv() {
  return { envName: process.env.DEPLOY_ENV };
}

export type DocUrlByIdResponse = {
  id: string;
  url: string;
};

export async function getDocUrlById(
  docId: string,
  reqObj: Request,
  resObj: Response
) {
  try {
    const config = await getConfig(reqObj, resObj);
    const doc = config.find(d => d.id === docId);
    if (doc) {
      const result: DocUrlByIdResponse = {
        id: doc.id,
        url: doc.url,
      };
      return result;
    } else {
      return {
        error: true,
        message: `Did not find a doc matching ID ${docId}`,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting document url  
              docId: ${docId}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}
