import fetch from 'node-fetch';
import { winstonLogger } from './loggerController';
import { Request, Response } from 'express';
import { VersionSelector } from '../model/entity/VersionSelector';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { FindOneAndDeleteOptions, FindOptionsWhere, ILike } from 'typeorm';
import { ApiResponse } from '../types/apiResponse';
import { Page } from '../model/entity/Page';
import { isUserAllowedToAccessResource } from './authController';

function optionsAreValid(options: {}) {
  return (
    options && Object.keys(options)?.length > 0 && !(options instanceof Array)
  );
}

async function pageExists(pagePath: string) {
  return (await AppDataSource.manager.countBy(Page, { path: pagePath })) === 1;
}

export async function getPage(reqObj: Request) {
  const landingPage = await findEntity(Page.name, {
    path: reqObj.path.replace(/^\//g, ''),
  });
  if (landingPage.status === 200) {
    return landingPage;
  }
  if (landingPage.status === 404) {
    const resourcePath = await findEntity(Page.name, {
      component: ILike('%resource%'),
      path: reqObj.path.split('/')[1],
    });
    if (resourcePath.status === 200) {
      return resourcePath;
    }
  }
  return null;
}

export async function getBreadcrumbs(pagePath: string): Promise<ApiResponse> {
  try {
    const routes = pagePath.split('/').filter(v => v.length > 0);
    const breadcrumbs = [];
    let startPath = '';
    for (const route of routes) {
      const breadcrumbRoutePath = startPath ? `/${route}` : route;
      const breadcrumbPath = startPath + breadcrumbRoutePath;
      const breadcrumbId = route.replace('/', '_').toLowerCase();
      const breadcrumbLabel = route
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str: string) => str.toUpperCase())
        .replace(
          /(policy center | billing center | claim center | insurance now)/gi,
          (str: string) => str.replace(' ', '')
        );
      breadcrumbs.push({
        label: breadcrumbLabel,
        path: breadcrumbPath,
        id: breadcrumbId,
      });
      startPath += breadcrumbRoutePath;
    }
    const validBreadcrumbs = [];
    for (const breadcrumb of breadcrumbs.slice(1, -1)) {
      if (await pageExists(breadcrumb.path)) {
        validBreadcrumbs.push(breadcrumb);
      }
    }
    return {
      status: 200,
      body: validBreadcrumbs,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function getEntity(reqObj: Request) {
  const { repo } = reqObj.params;
  const options = reqObj.query;
  const operationResult = await findEntity(repo, options);
  if (operationResult.status === 200) {
    const userIsAllowedToAccessResource = await isUserAllowedToAccessResource(
      reqObj,
      operationResult.body?.public || false,
      operationResult.body?.internal || false
    );
    if (userIsAllowedToAccessResource.status === 200) {
      return operationResult;
    }
    return userIsAllowedToAccessResource;
  }
  return operationResult;
}

export async function findEntity(
  repo: string,
  options: FindOptionsWhere<any>
): Promise<ApiResponse> {
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

export async function getAllEntities(repo: string): Promise<ApiResponse> {
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
): Promise<ApiResponse> {
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
): Promise<ApiResponse> {
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
    const getEntityResponse = await findEntity(Doc.name, { id: docId });
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

export async function getDocByUrl(url: string) {
  const urlToCheck = url.replace(/^\//g, '');
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
