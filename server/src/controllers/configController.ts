import fetch from 'node-fetch';
import { winstonLogger } from './loggerController';
import { Request, Response } from 'express';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { Product } from '../model/entity/Product';
import { Release } from '../model/entity/Release';
import { FindOneAndDeleteOptions, FindOptionsWhere } from 'typeorm';
import { ApiResponse } from '../types/apiResponse';
import { Page } from '../model/entity/Page';
import { isUserAllowedToAccessResource } from './authController';
import { LegacyVersionObject } from '../types/legacyConfig';

function optionsAreValid(options: {}) {
  return (
    options && Object.keys(options)?.length > 0 && !(options instanceof Array)
  );
}

export async function getBreadcrumbs(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  try {
    const { path } = req.query;
    if (!path) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "path" query parameter to get breadcrumbs.',
        },
      };
    }
    const routes = (path as string).split('/').filter((v) => v.length > 0);
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
      const findPageResult = await findEntity(
        Page.name,
        { path: breadcrumb.path },
        false
      );
      if (findPageResult.status === 200) {
        const isUserAllowedToAccessResourceResult =
          isUserAllowedToAccessResource(
            res,
            findPageResult.body.public,
            findPageResult.body.internal,
            findPageResult.body.isInProduction
          );
        if (isUserAllowedToAccessResourceResult.status === 200) {
          validBreadcrumbs.push(breadcrumb);
        }
      }
    }
    return {
      status: 200,
      body: validBreadcrumbs,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function getEntity(reqObj: Request, resObj: Response) {
  const { repo } = reqObj.params;
  const options = reqObj.query;
  const findEntityResult = await findEntity(repo, options);
  if (findEntityResult.status === 200) {
    const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
      resObj,
      findEntityResult.body.public,
      findEntityResult.body.internal,
      findEntityResult.body.isInProduction
    );
    if (isUserAllowedToAccessResourceResult.status === 200) {
      return findEntityResult;
    }
    return isUserAllowedToAccessResourceResult;
  }
  return findEntityResult;
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
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function getAllEntities(
  repoName: string,
  res: Response
): Promise<ApiResponse> {
  const findAllEntitiesResult = await findAllEntities(repoName);
  if (findAllEntitiesResult.status === 200) {
    const availableEntities = [];
    for (const entity of findAllEntitiesResult.body) {
      const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
        res,
        entity.public,
        entity.internal,
        entity.isInProduction
      );
      if (isUserAllowedToAccessResourceResult.status === 200) {
        availableEntities.push(entity);
      }
    }
    return {
      status: findAllEntitiesResult.status,
      body: availableEntities,
    };
  }
  return findAllEntitiesResult;
}

export async function findAllEntities(repoName: string): Promise<ApiResponse> {
  try {
    const result = await AppDataSource.manager.find(repoName);
    if (!result) {
      return {
        status: 404,
        body: {
          message: `Did not find entities in ${repoName}`,
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
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function createOrUpdateEntity(
  repoName: string,
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
    const result = await AppDataSource.manager.save(repoName, options);
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

export async function deleteEntity(
  repoName: string,
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
    const result = await AppDataSource.manager.delete(repoName, options);
    return {
      status: 200,
      body: result,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
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

export async function getDocumentMetadataById(req: Request, res: Response) {
  // Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
  // values that contain commas must be wrapped in quotes.
  // Filter values are parsed by the getFiltersFromUrl function in searchController.js.
  try {
    const { id } = req.query;
    if (!id) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "id" query parameter to get doc metadata.',
        },
      };
    }
    const findEntityResult = await findEntity(Doc.name, { id: id });
    if (findEntityResult.status === 200) {
      const docInfo = findEntityResult.body;
      const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
        res,
        docInfo.public,
        docInfo.internal,
        docInfo.isInProduction
      );
      if (isUserAllowedToAccessResourceResult.status === 200) {
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
      return isUserAllowedToAccessResourceResult;
    }
    return findEntityResult;
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function getDocByUrl(url: string) {
  const urlToCheck = url.replace(/^\//g, '');
  return await AppDataSource.getRepository(Doc)
    .createQueryBuilder('doc')
    .useIndex('docUrl-idx')
    .select([
      'doc.url',
      'doc.id',
      'doc.public',
      'doc.internal',
      'doc.isInProduction',
    ])
    .where(":urlToCheck LIKE concat(doc.url, '%')", { urlToCheck: urlToCheck })
    .getOne();
}

export async function getDocIdByUrl(req: Request, res: Response) {
  const { url } = req.query;
  if (!url) {
    return {
      status: 400,
      body: {
        message:
          'Invalid request. Provide the "url" query parameter to get a version selector',
      },
    };
  }
  const doc = await getDocByUrl(url as string);
  if (!doc) {
    return {
      status: 404,
      body: {
        message: `Doc ID for the ${url} url was not found.`,
      },
    };
  }
  const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
    res,
    doc.public,
    doc.internal,
    doc.isInProduction
  );
  if (isUserAllowedToAccessResourceResult.status === 200) {
    return {
      status: 200,
      body: { docId: doc.id },
    };
  }
  return isUserAllowedToAccessResourceResult;
}

// TODO: Change this function to work with the database. It's used in docs to inject the root breadcrumb.
//  We may need to build a site taxonomy to be able to achieve it
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
  req: Request,
  res: Response
): Promise<ApiResponse> {
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
    const { docId } = req.query;
    if (!docId) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "docID" query parameter to get a version selector',
        },
      };
    }

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

      const availableDocsWithTheSameTitle = [];
      for (const docWithTheSameTitle of docsWithTheSameTitle) {
        const isUserAllowedToAccessResourceResult =
          isUserAllowedToAccessResource(
            res,
            docWithTheSameTitle.public,
            docWithTheSameTitle.internal,
            docWithTheSameTitle.isInProduction
          );
        if (isUserAllowedToAccessResourceResult.status === 200) {
          availableDocsWithTheSameTitle.push(docWithTheSameTitle);
        }
      }
      const otherVersions = availableDocsWithTheSameTitle.map((doc) => {
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
        status: 200,
        body: {
          matchingVersionSelector: {
            docId: docResponse.id,
            allVersions: sortVersions(allVersions, useReleaseForLabel),
          },
        },
      };
    }
    return {
      status: 404,
      body: { message: `Cannot find the document for ID ${docId}` },
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}
