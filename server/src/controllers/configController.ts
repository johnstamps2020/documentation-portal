import fetch from 'node-fetch';
import { winstonLogger } from './loggerController';
import { Request, Response } from 'express';
import { VersionSelector } from '../model/entity/VersionSelector';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { integer } from '@elastic/elasticsearch/api/types';
import { FindOneAndDeleteOptions, FindOptionsWhere } from 'typeorm';
import { Environment } from '../types/legacyConfig';
import { readdirSync, lstatSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

function optionsAreValid(options: {}) {
  return (
    options && Object.keys(options)?.length > 0 && !(options instanceof Array)
  );
}

export async function getEntity(
  repo: string,
  options: FindOptionsWhere<any>
): Promise<{ status: integer; body: any }> {
  try {
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
      options
    );
    if (!operationResult) {
      return {
        status: 404,
        body: {
          message: `Did not find an entity in ${repo} for the following query: ${JSON.stringify(
            options
          )}`,
        },
      };
    }
    return {
      status: 200,
      body: operationResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function getAllEntities(
  repo: string
): Promise<{ status: integer; body: any }> {
  try {
    const operationResult = await AppDataSource.manager.find(repo);
    if (!operationResult) {
      return {
        status: 404,
        body: {
          message: `Did not find any entities in ${repo}`,
        },
      };
    }
    return {
      status: 200,
      body: operationResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function createOrUpdateEntity(
  repo: string,
  options: {}
): Promise<{ status: integer; body: any }> {
  try {
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
      body: operationResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function deleteEntity(
  repo: string,
  options: FindOneAndDeleteOptions
): Promise<{ status: integer; body: any }> {
  try {
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
      body: operationResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

function wrapInQuotes(stringsToWrap: Array<string> | string | undefined) {
  const valueSeparator = ',';

  function addQuotes(stringToModify: string) {
    return stringToModify.includes(',')
      ? '"' + stringToModify + '"'
      : stringToModify;
  }

  if (Array.isArray(stringsToWrap)) {
    return stringsToWrap.map(s => addQuotes(s)).join(valueSeparator);
  } else if (typeof stringsToWrap === 'string') {
    return addQuotes(stringsToWrap);
  } else {
    return stringsToWrap;
  }
}

export async function getDocumentMetadataById(docId: string) {
  // Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
  // values that contain commas must be wrapped in quotes.
  // Filter values are parsed by the getFiltersFromUrl function in searchController.js.
  try {
    if (!docId) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the docId param to get doc metadata.',
        },
      };
    }
    const getEntityResponse = await getEntity(Doc.name, { id: docId });
    if (getEntityResponse.status === 200) {
      const docInfo = getEntityResponse.body;
      return {
        status: 200,
        body: {
          docTitle: wrapInQuotes(docInfo.title),
          docInternal: docInfo.internal,
          docEarlyAccess: docInfo.earlyAccess,
          docProducts: wrapInQuotes(
            docInfo.products.map((p: Product) => p.name.name)
          ),
          docVersions: wrapInQuotes(
            docInfo.products.map((p: Product) => p.version.name)
          ),
          docPlatforms: wrapInQuotes(
            docInfo.products.map((p: Product) => p.platform.name)
          ),
          docReleases: wrapInQuotes(
            docInfo.releases.map((r: Release) => r.name)
          ),
          docSubjects: wrapInQuotes(docInfo.subjects),
          docCategories: wrapInQuotes(docInfo.categories),
        },
      };
    }
    return getEntityResponse;
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

function readFilesInDir(dirPath: string, deployEnv: Environment): Doc[] {
  try {
    const localConfig: Doc[] = [];
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig.push(...readFilesInDir(itemPath, deployEnv));
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: any = JSON.parse(config);
        const docs = json.docs.filter((d: any) =>
          d.environments.includes(deployEnv)
        );
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

async function fetchConfig() {
  const result = await fetch(
    `${process.env.DOC_S3_URL}/portal-config/config.json`
  );
  if (result.ok == false) {
    throw new Error(
      `Response status: ${result.status}
              Response type: ${result.type}
              Response URL: ${result.url}
              Response redirected: ${result.redirected}`
    );
  }
  const config = await result.json();

  return config.docs;
}

export async function getDocByUrl(url: string) {
  let urlToCheck = url;
  if (url.startsWith('/')) {
    urlToCheck = url.substring(1);
  }
  const docUrls = await AppDataSource.getRepository(Doc)
    .createQueryBuilder('doc')
    .useIndex('docUrl-idx')
    .select(['doc.url', 'doc.id', 'doc.public', 'doc.internal'])
    .getMany();

  const matchingDoc = docUrls.find(d => urlToCheck.startsWith(d.url));
  return matchingDoc;
}

export async function getDocIdByUrl(url: string) {
  const doc = await getDocByUrl(url);
  if (!doc) {
    return {
      status: 404,
      body: {
        message: `Doc ID matching the ${url} url was not found.`,
      },
    };
  }
  return {
    status: 200,
    body: { docId: doc.id },
  };
}

export async function isPublicDoc(url: string) {
  try {
    const matchingDoc = await getDocByUrl(url);
    return matchingDoc && matchingDoc.public;
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
    return matchingDoc && matchingDoc.internal;
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
        if (matchingVersionSelector) {
          const isLoggedIn = reqObj.session?.requestIsAuthenticated;
          const hasGuidewireEmail = resObj.locals.userInfo?.hasGuidewireEmail;
          const options: FindOptionsWhere<Doc> = {};
          if (!isLoggedIn) {
            options.public = true;
          }
          if (!hasGuidewireEmail) {
            options.internal = false;
          }
          const docUrls = await AppDataSource.getRepository(Doc)
            .createQueryBuilder('doc')
            .useIndex('docUrl-idx')
            .select(['doc.url'])
            .where(options)
            .getMany();
          matchingVersionSelector[
            'allVersions'
          ] = matchingVersionSelector.allVersions.filter(v =>
            docUrls.find(d => d.url === v.url)
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

export function getEnv() {
  return { envName: process.env.DEPLOY_ENV };
}

export type DocUrlByIdResponse = {
  id: string;
  url: string;
};
