import fetch from 'node-fetch';
import { winstonLogger } from './loggerController';
import { Request, Response } from 'express';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { FindOneAndDeleteOptions, FindOptionsWhere, ILike } from 'typeorm';
import { ApiResponse } from '../types/apiResponse';
import { Page } from '../model/entity/Page';
import {
  isUserAllowedToAccessResource,
  isUserAllowedToManageResource,
} from './authController';
import { LegacyVersionObject } from '../types/legacyConfig';

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
    path: reqObj.path.replace(/^(\/)(.+)/g, '$2'),
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
    const routes = pagePath.split('/').filter((v) => v.length > 0);
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

function getItemProps(itemName: string, primaryKeyName: string) {
  return [
    `${itemName}.${primaryKeyName}`,
    `${itemName}.internal`,
    `${itemName}.public`,
    `${itemName}.earlyAccess`,
  ];
}

export async function getEntity(reqObj: Request, resObj: Response) {
  const { repo } = reqObj.params;
  const options = reqObj.query;
  const result = await findEntity(repo, options);
  if (result.status === 200) {
    const userIsAllowedToAccessResource = isUserAllowedToAccessResource(
      resObj,
      result.body?.public || false,
      result.body?.internal || false,
      result.body?.isInProduction || false
    );
    if (userIsAllowedToAccessResource.status === 200) {
      return result;
    }
    return userIsAllowedToAccessResource;
  }
  return result;
}

export async function findEntity(
  repoName: string,
  options: FindOptionsWhere<any>,
  loadRelations: boolean = true
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
    let result;
    if (loadRelations) {
      result = await AppDataSource.manager.findOneBy(repoName, options);
    } else {
      result = await AppDataSource.getRepository(repoName)
        .createQueryBuilder(repoName)
        .where(options)
        .getOne();
    }
    if (!result) {
      return {
        status: 404,
        body: {
          message: `Did not find an entity in ${repoName} for the following query: ${JSON.stringify(
            options
          )}`,
        },
      };
    }
    return {
      status: 200,
      body: result,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function getAllEntities(
  repoName: string,
  res: Response
): Promise<ApiResponse> {
  try {
    const result = await AppDataSource.manager.find(repoName);
    if (!result) {
      return {
        status: 404,
        body: {
          message: `Did not find any entities in ${repoName}`,
        },
      };
    }
    const availableEntities = [];
    for (const entity of result) {
      //FIXME: If an entity doesn't have the public prop, we set public to false by default.
      // But this setting breaks the some frontend elements, such as the useReleases hook.
      const { status, body } = isUserAllowedToAccessResource(
        res,
        entity.public || false,
        entity.internal || false,
        entity.isInProduction || true
      );
      if (status === 200) {
        availableEntities.push(entity);
      }
    }
    return {
      status: 200,
      body: availableEntities,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function createOrUpdateEntity(
  repoName: string,
  options: {},
  res: Response
): Promise<ApiResponse> {
  try {
    const { status, body } = isUserAllowedToManageResource(res);
    if (status !== 200) {
      return { status, body };
    }
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Body cannot be empty or an array.',
        },
      };
    }
    const result = await AppDataSource.manager.save(repoName, options);
    return {
      status: status,
      body: result,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${(err as Error).message}` },
    };
  }
}

export async function deleteEntity(
  repoName: string,
  options: FindOneAndDeleteOptions,
  res: Response
): Promise<ApiResponse> {
  try {
    const { status, body } = isUserAllowedToManageResource(res);
    if (status !== 200) {
      return { status, body };
    }
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Body cannot be empty or an array.',
        },
      };
    }
    const result = await AppDataSource.manager.delete(repoName, options);
    return {
      status: status,
      body: result,
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
    return stringsToWrap.map((s) => addQuotes(s)).join(valueSeparator);
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
            docInfo.products.map((p: Product) => p.name)
          ),
          docVersions: wrapInQuotes(
            docInfo.products.map((p: Product) => p.version)
          ),
          docPlatforms: wrapInQuotes(
            docInfo.products.map((p: Product) => p.platform)
          ),
          docReleases: wrapInQuotes(
            docInfo.releases.map((r: Release) => r.name)
          ),
          docSubjects: wrapInQuotes(docInfo.sections),
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
  return await AppDataSource.getRepository(Doc)
    .createQueryBuilder('doc')
    .useIndex('docUrl-idx')
    .select(['doc.url', 'doc.id', 'doc.public', 'doc.internal'])
    .where(":urlToCheck LIKE concat(doc.url, '%')", { urlToCheck: urlToCheck })
    .getOne();
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

// TODO: Change this function to work with the database. It's used in docs to inject the root breadcrumb.
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

// FIXME: The version selector must filter out versions that the user cannot access
export async function getVersionSelector(docId: string) {
  function getLabel(docConfig: Doc, releaseInLabel: boolean) {
    const docReleases = docConfig.releases.map((r) => r.name);
    const docVersions = docConfig.products.map((p) => p.version);
    return releaseInLabel
      ? `${docReleases[0]} (${docVersions[0]})`
      : docVersions.join(',');
  }

  function sortVersions(
    unsortedVersions: Array<LegacyVersionObject>,
    releaseInLabel: boolean
  ) {
    return releaseInLabel
      ? unsortedVersions.sort((a, b) => (a.label > b.label ? 1 : -1)).reverse()
      : unsortedVersions
          .sort(function (a, b) {
            const labelA = a.label
              .split('.')
              .map((n) => +n + 100000)
              .join('.');
            const labelB = b.label
              .split('.')
              .map((n) => +n + 100000)
              .join('.');
            return labelA > labelB ? 1 : -1;
          })
          .reverse();
  }

  try {
    const docQueryBuilder = await AppDataSource.getRepository(Doc)
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.products', 'docProducts')
      .leftJoinAndSelect('doc.releases', 'docReleases');
    const docResponse = await docQueryBuilder.where({ id: docId }).getOne();
    if (docResponse) {
      const useReleaseForLabel = docResponse.releases?.length === 1;
      // FIXME: Add query for displayOnLandingPages unless we remove this parameter
      const docsWithTheSameTitle = await docQueryBuilder
        .where('title = :title', { title: docResponse.title })
        .andWhere('docProducts.name IN (:...productNames)', {
          productNames: docResponse.products.map((p) => p.name),
        })
        .andWhere('docProducts.platform IN (:...productPlatforms)', {
          productPlatforms: docResponse.products.map((p) => p.platform),
        })
        .andWhere('docProducts.version NOT IN (:...productVersions)', {
          productVersions: docResponse.products.map((p) => p.version),
        })
        .getMany();
      const otherVersions = docsWithTheSameTitle.map((doc) => {
        return {
          versions: doc.products.map((p) => p.version),
          releases: doc.releases.map((r) => r.name),
          url: doc.url,
          label: getLabel(doc, useReleaseForLabel),
        };
      });
      const allVersions = [
        {
          versions: docResponse.products.map((p) => p.version),
          releases: docResponse.releases.map((r) => r.name),
          url: docResponse.url,
          currentlySelected: true,
          label: getLabel(docResponse, useReleaseForLabel),
        },
        ...otherVersions,
      ];

      return {
        matchingVersionSelector: {
          docId: docResponse.id,
          allVersions: sortVersions(allVersions, useReleaseForLabel),
        },
      };
    } else {
      return { matchingVersionSelector: {} };
    }
  } catch (err) {
    winstonLogger.error(
      `Holy Moly! Cannot get version selector for docId ${docId}!
          ERROR: ${JSON.stringify(err)}`
    );
    return { matchingVersionSelector: {} };
  }
}

export function getEnv() {
  return { envName: process.env.DEPLOY_ENV };
}
