import fetch from 'node-fetch';
import { winstonLogger } from './loggerController';
import { Request, Response } from 'express';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { PlatformProductVersion } from '../model/entity/PlatformProductVersion';
import { Release } from '../model/entity/Release';
import {
  FindOneAndDeleteOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { ApiResponse } from '../types/apiResponse';
import { Page } from '../model/entity/Page';
import { isUserAllowedToAccessResource } from './authController';
import { LegacyVersionObject } from '../types/legacyConfig';

function wrapInQuotes(
  stringsToWrap: string[] | string | undefined
): string[] | string | undefined {
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

function optionsAreValid(options: {}): boolean {
  return (
    options && Object.keys(options)?.length > 0 && !(options instanceof Array)
  );
}

export async function getDocByUrl(url: string): Promise<Doc | null> {
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

function getRelationOptionsForEntity(
  entityName: string
): FindOptionsRelations<ObjectLiteral> | null {
  const lowerCaseEntityName = entityName.toLowerCase();
  let relations: FindOptionsRelations<ObjectLiteral> | null = null;
  if (lowerCaseEntityName === 'doc') {
    relations = {
      platformProductVersions: {
        platform: true,
        product: true,
        version: true,
      },
      releases: true,
      subjects: true,
      locales: true,
    };
  } else if (
    ['yarnbuild', 'ditabuild', 'sourcezipbuild', 'justcopybuild'].includes(
      lowerCaseEntityName
    )
  ) {
    relations = {
      source: true,
      doc: true,
      resources: {
        source: true,
      },
    };
  } else if (lowerCaseEntityName === 'platformproductversion') {
    relations = {
      platform: true,
      product: true,
      version: true,
    };
  } else if (lowerCaseEntityName === 'resource') {
    relations = { source: true };
  }
  return relations;
}

export async function findEntity(
  entityName: string,
  where: FindOptionsWhere<ObjectLiteral>,
  loadRelations: boolean = true
): Promise<ObjectLiteral | null> {
  let findOptions: FindOneOptions<ObjectLiteral> = {
    where: where,
  };
  if (loadRelations) {
    const relations = getRelationOptionsForEntity(entityName);
    if (relations) {
      findOptions.relations = relations;
    }
  }
  return await AppDataSource.manager.findOne(entityName, findOptions);
}

export async function findAllEntities(
  entityName: string,
  loadRelations: boolean = true
): Promise<ObjectLiteral[] | null> {
  let findOptions: FindOneOptions<ObjectLiteral> = {};
  if (loadRelations) {
    const relations = getRelationOptionsForEntity(entityName);
    if (relations) {
      findOptions.relations = relations;
    }
  }
  return await AppDataSource.manager.find(entityName, findOptions);
}

export async function saveEntities(
  entityInstances: ObjectLiteral | ObjectLiteral[]
) {
  return await AppDataSource.manager.save(entityInstances);
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
      const breadcrumbLabel = route;
      breadcrumbs.push({
        label: breadcrumbLabel,
        path: breadcrumbPath,
        id: breadcrumbId,
      });
      startPath += breadcrumbRoutePath;
    }
    const validBreadcrumbs = [];
    const breadcrumbsToValidate = breadcrumbs.find(
      (obj) => obj.path === 'cloudProducts'
    )
      ? breadcrumbs.slice(1, -1)
      : breadcrumbs.slice(0, -1);
    for (const breadcrumb of breadcrumbsToValidate) {
      const findPageResult = await findEntity(
        Page.name,
        {
          path: breadcrumb.path,
        },
        false
      );
      if (findPageResult) {
        const isUserAllowedToAccessResourceResult =
          isUserAllowedToAccessResource(
            res,
            findPageResult.public,
            findPageResult.internal,
            findPageResult.isInProduction
          );
        if (isUserAllowedToAccessResourceResult.status === 200) {
          breadcrumb.label =
            findPageResult.title === 'Automated redirect'
              ? ''
              : findPageResult.title;
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

export async function getEntity(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  const { repo } = req.params;
  const options: FindOptionsWhere<any> = req.query;
  if (!optionsAreValid(options)) {
    return {
      status: 400,
      body: {
        message: 'Invalid request. Provide query parameters in the URL.',
      },
    };
  }
  try {
    const findEntityResult = await findEntity(repo, options, false);
    if (!findEntityResult) {
      return {
        status: 404,
        body: {
          message: `Did not find an entity in ${repo} for the following query: ${JSON.stringify(
            options
          )}`,
        },
      };
    }
    const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
      res,
      findEntityResult.public,
      findEntityResult.internal,
      findEntityResult.isInProduction
    );
    if (isUserAllowedToAccessResourceResult.status === 200) {
      return {
        status: 200,
        body: findEntityResult,
      };
    }
    return isUserAllowedToAccessResourceResult;
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function getAllEntities(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  try {
    const { repo } = req.params;
    const findAllEntitiesResult = await findAllEntities(repo, false);
    if (!findAllEntitiesResult) {
      return {
        status: 404,
        body: {
          message: `Did not find entities in ${repo}`,
        },
      };
    }
    const availableEntities = [];
    for (const entity of findAllEntitiesResult) {
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
      status: 200,
      body: availableEntities,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function createOrUpdateEntity(req: Request): Promise<ApiResponse> {
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
    const result = await AppDataSource.manager.save(repo, options);
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

export async function deleteEntity(req: Request): Promise<ApiResponse> {
  try {
    const { repo } = req.params;
    const options: FindOneAndDeleteOptions = req.body;
    if (!optionsAreValid(options)) {
      return {
        status: 400,
        body: {
          message: 'Invalid request. Body cannot be empty or an array.',
        },
      };
    }
    const result = await AppDataSource.manager.delete(repo, options);
    if (result.affected === 1) {
      return {
        status: 200,
        body: result,
      };
    }
    return {
      status: 404,
      body: {
        message: 'Entity not found',
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export function splitLegacyValueByComma(commaSeparated: string): string[] {
  if (!commaSeparated) {
    return [];
  }

  return commaSeparated.split(',');
}

export function removeQuotesFromLegacySearchParams(
  queryString: string
): string {
  return queryString.replace(/["(%22)]/g, '');
}

export async function getDocumentMetadataById(
  id: string | undefined,
  res: Response
): Promise<ApiResponse> {
  // Filter values are passed around as strings that use commas to separate values. To avoid issues with splitting,
  // values that contain commas must be wrapped in quotes.
  // Filter values are parsed by the getFiltersFromUrl function in searchController.js.
  try {
    if (!id) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "id" query parameter to get doc metadata.',
        },
      };
    }
    const docInfo = (await AppDataSource.manager.findOne(Doc.name, {
      where: { id: id } as ObjectLiteral,
      relations: {
        platformProductVersions: {
          platform: true,
          product: true,
          version: true,
        },
        releases: true,
        subjects: true,
      } as ObjectLiteral,
    })) as ObjectLiteral;
    if (docInfo) {
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
              docInfo.platformProductVersions.map(
                (ppv: PlatformProductVersion) => ppv.product.name
              )
            ),
            docVersions: wrapInQuotes(
              docInfo.platformProductVersions.map(
                (ppv: PlatformProductVersion) => ppv.version.name
              )
            ),
            docPlatforms: wrapInQuotes(
              docInfo.platformProductVersions.map(
                (ppv: PlatformProductVersion) => ppv.platform.name
              )
            ),
            docReleases: wrapInQuotes(
              docInfo.releases.map((r: Release) => r.name)
            ),
            docSubjects: wrapInQuotes(docInfo.sections),
          },
        };
      }
      return isUserAllowedToAccessResourceResult;
    }
    return {
      status: 404,
      body: { message: `Cannot find the document with ID: ${id}` },
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}

export async function getDocIdByUrl(
  req: Request,
  res: Response
): Promise<ApiResponse> {
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

export async function getVersionSelector(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  function getLabel(docConfig: Doc, releaseInLabel: boolean) {
    const docReleases = docConfig.releases?.map((r) => r.name) || [];
    const docVersions = docConfig.platformProductVersions.map(
      (p) => p.version.name
    );
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
      .leftJoinAndSelect(
        'doc.platformProductVersions',
        'docPlatformProductVersions'
      )
      .leftJoinAndSelect('doc.releases', 'docReleases');
    const docResponse = await docQueryBuilder
      .leftJoinAndSelect(
        'docPlatformProductVersions.platform',
        'docPlatformProductVersionsPlatform'
      )
      .leftJoinAndSelect(
        'docPlatformProductVersions.product',
        'docPlatformProductVersionsProduct'
      )
      .leftJoinAndSelect(
        'docPlatformProductVersions.version',
        'docPlatformProductVersionsVersion'
      )
      .where({ id: docId })
      .getOne();
    if (docResponse) {
      const useReleaseForLabel = docResponse.releases?.length === 1;
      // FIXME: Add query for displayOnLandingPages unless we remove this parameter
      const docsWithTheSameTitle = await docQueryBuilder
        .where('title = :title', { title: docResponse.title })
        .andWhere(
          'docPlatformProductVersionsPlatform.name IN (:...productPlatforms)',
          {
            productPlatforms: docResponse.platformProductVersions.map(
              (ppv) => ppv.platform.name
            ),
          }
        )
        .andWhere(
          'docPlatformProductVersionsProduct.name IN (:...productNames)',
          {
            productNames: docResponse.platformProductVersions.map(
              (ppv) => ppv.product.name
            ),
          }
        )
        .andWhere(
          'docPlatformProductVersionsVersion.name NOT IN (:...productVersions)',
          {
            productVersions: docResponse.platformProductVersions.map(
              (ppv) => ppv.version.name
            ),
          }
        )
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
          versions: doc.platformProductVersions.map((p) => p.version.name),
          releases: doc.releases?.map((r) => r.name) || [],
          url: doc.url,
          label: getLabel(doc, useReleaseForLabel),
        };
      });
      const allVersions = [
        {
          versions: docResponse.platformProductVersions.map(
            (p) => p.version.name
          ),
          releases: docResponse.releases?.map((r) => r.name) || [],
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

export async function getRootBreadcrumb(pagePathname: string) {
  const emptyRootPage = {
    rootPage: {},
  };
  try {
    const response = await fetch(
      `${process.env.APP_BASE_URL}/root-breadcrumbs.json`
    );
    if (!response.ok) {
      return emptyRootPage;
    }
    const breadcrumbsJson = await response.json();
    const docEntity = await getDocByUrl(pagePathname);
    if (!docEntity) {
      return emptyRootPage;
    }
    const matchingBreadcrumb = breadcrumbsJson.find(
      (b: { docId: string; rootPages: string[] }) => b.docId === docEntity.id
    );
    if (matchingBreadcrumb.rootPages.length !== 1) {
      return emptyRootPage;
    }
    const rootPagePath = matchingBreadcrumb.rootPages[0];
    const rootPageEntity = await findEntity(
      Page.name,
      {
        path: rootPagePath,
      },
      false
    );
    if (!rootPageEntity) {
      return emptyRootPage;
    }
    return {
      rootPage: {
        path: matchingBreadcrumb.rootPages[0],
        label: rootPageEntity.title,
      },
    };
  } catch (err) {
    winstonLogger.error(
      `Problem getting root breadcrumb for page: "${pagePathname}":
          ERROR: ${JSON.stringify(err)}`
    );
    return emptyRootPage;
  }
}
