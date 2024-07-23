import 'dotenv/config';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import {
  FindOneAndDeleteOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  ObjectLiteral,
} from 'typeorm';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { ExternalLink } from '../model/entity/ExternalLink';
import { Page } from '../model/entity/Page';
import { PlatformProductVersion } from '../model/entity/PlatformProductVersion';
import { Release } from '../model/entity/Release';
import { Subject } from '../model/entity/Subject';
import { ApiResponse } from '../types/apiResponse';
import { PageItemsRequestBody, PageItemsResponse } from '../types/config';
import { LegacyVersionObject } from '../types/legacyConfig';
import { isUserAllowedToAccessResource } from './authController';
import { winstonLogger } from './loggerController';

function wrapInQuotes(
  stringsToWrap: string[] | string | undefined
): string[] | string | undefined {
  const valueSeparator = ',';

  const addQuotes = function (stringToModify: string) {
    return stringToModify.includes(',')
      ? '"' + stringToModify + '"'
      : stringToModify;
  };

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

/* 
Finds a doc URL based on product, version, title and language.
 ** WARNING: This function is a bit fuzzy. It will find a match
 ** if the doc title that is passed to it matches either exactly
 ** or has ' Guide' appended to it. Many docs are in the config
 ** as, for example, "Installation", but to avoid awkward human-speech
 ** in prose, are defined in library keys as "Installation Guide", so
 ** we allow that one exception. 
 */
export async function getDocUrlByMetadata(
  products: string,
  versions: string,
  title: string,
  language: string,
  res: Response
): Promise<ApiResponse> {
  try {
    if (!products || !versions || !title || !language) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the following query parameters in the URL: products, versions, title, language',
        },
      };
    }
    const doc = await AppDataSource.getRepository(Doc)
      .createQueryBuilder('doc')
      .leftJoinAndSelect(
        'doc.platformProductVersions',
        'docPlatformProductVersions'
      )
      .leftJoinAndSelect('doc.language', 'docLanguage')
      .leftJoinAndSelect(
        'docPlatformProductVersions.product',
        'docPlatformProductVersionsProduct'
      )
      .leftJoinAndSelect(
        'docPlatformProductVersions.version',
        'docPlatformProductVersionsVersion'
      )
      .where('title IN (:...titles)', {
        titles: [
          title,
          title.includes('Guide')
            ? title.replace('Guide', '').trim()
            : `${title} Guide`,
        ],
      })
      .andWhere('docLanguage.code = :language', { language: language })
      .andWhere(
        'docPlatformProductVersionsProduct.name IN (:...productNames)',
        {
          productNames: products.split(','),
        }
      )
      .andWhere(
        'docPlatformProductVersionsVersion.name IN (:...productVersions)',
        {
          productVersions: versions.split(','),
        }
      )
      .cache(true)
      .getOne();
    if (!doc) {
      return {
        status: 404,
        body: {
          message: `Doc URL was not found for these properties: ${products}, ${versions}, ${title}, ${language}.`,
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
        body: { url: doc.url },
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

/*
The function looks for many Doc entities in the db because sometimes the first match is not correct.
For example, we have these two URLs:
- 'jutro/platform/hakuba'
- 'jutro/platform/hakuba2'
We want to open 'jutro/platform/hakuba2'. If we look just for the first match, the search returns 'jutro/platform/hakuba'.
Instead, we look for all matches and select the longest URL.
*/
export async function getDocByUrl(url: string): Promise<Doc | null> {
  const urlWithoutPrecedingSlash = url.replace(/^\//g, '');
  const matchingDocs = await AppDataSource.getRepository(Doc)
    .createQueryBuilder('doc')
    .useIndex('docUrl-idx')
    .select([
      'doc.url',
      'doc.id',
      'doc.public',
      'doc.ignorePublicPropertyAndUseVariants',
      'doc.internal',
      'doc.isInProduction',
    ])
    .where(":urlToCheck LIKE concat(doc.url, '%')", {
      urlToCheck: urlWithoutPrecedingSlash,
    })
    .cache(true)
    .getMany();
  return matchingDocs.sort((a, b) => b.url.length - a.url.length)[0];
}

export async function getExternalLinkByUrl(
  url: string
): Promise<ExternalLink | null> {
  const urlWithoutTrailingSlash = url.replace(/\/$/g, '');
  const matchingExternalLinks = await AppDataSource.getRepository(ExternalLink)
    .createQueryBuilder('externalLink')
    .useIndex('externalLinkUrls-idx')
    .select([
      'externalLink.url',
      'externalLink.public',
      'externalLink.internal',
      'externalLink.isInProduction',
    ])
    .where(":urlToCheck LIKE concat(externalLink.url, '%')", {
      urlToCheck: urlWithoutTrailingSlash,
    })
    .cache(true)
    .getMany();
  return matchingExternalLinks.sort((a, b) => b.url.length - a.url.length)[0];
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
      language: true,
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

export async function findEntities(
  entityName: string,
  where: FindOptionsWhere<ObjectLiteral>,
  loadRelations: boolean = true
): Promise<ObjectLiteral[] | null> {
  let findOptions: FindOneOptions<ObjectLiteral> = { where: where };
  if (loadRelations) {
    const relations = getRelationOptionsForEntity(entityName);
    if (relations) {
      findOptions.relations = relations;
    }
  }
  return await AppDataSource.manager.find(entityName, findOptions);
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
      breadcrumbs.push({
        label: route,
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
          breadcrumb.label = findPageResult.title;
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
  res: Response,
  loadRelations: boolean = false
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
    const findEntityResult = await findEntity(repo, options, loadRelations);
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

export async function getEntities(
  req: Request,
  res: Response,
  loadRelations: boolean = false
): Promise<ApiResponse> {
  const options: FindOptionsWhere<any> = req.query;
  const { repo } = req.params;
  if (!optionsAreValid(options)) {
    return {
      status: 400,
      body: {
        message: 'Invalid request. Provide query parameters in the URL.',
      },
    };
  }
  try {
    const findAllEntitiesResult = await findEntities(
      repo,
      options,
      loadRelations
    );
    if (!findAllEntitiesResult || findAllEntitiesResult.length === 0) {
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
    if (availableEntities.length === 0) {
      return {
        status: 403,
        body: {
          message: 'Not authorized to view entities',
        },
      };
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

export async function getAllEntities(
  req: Request,
  res: Response,
  loadRelations: boolean = false
): Promise<ApiResponse> {
  try {
    const { repo } = req.params;
    const findAllEntitiesResult = await findAllEntities(repo, loadRelations);
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
    if (availableEntities.length === 0) {
      return {
        status: 403,
        body: {
          message: 'Not authorized to view entities',
        },
      };
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

async function createOrUpdate(
  req: Request,
  invalidRequestMessage: string,
  errorMessage: string,
  validationFunction: (options: any) => boolean
): Promise<ApiResponse> {
  try {
    const { repo } = req.params;
    const options = req.body;
    if (!validationFunction(options)) {
      return {
        status: 400,
        body: {
          message: `Invalid request. ${invalidRequestMessage}`,
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
      body: { message: `${errorMessage}: ${(err as Error).message}` },
    };
  }
}

export async function createOrUpdateEntity(req: Request): Promise<ApiResponse> {
  return createOrUpdate(
    req,
    'Body cannot be empty or an array.',
    'saving entity failed',
    optionsAreValid
  );
}

export async function createOrUpdateMultipleEntities(
  req: Request
): Promise<ApiResponse> {
  return createOrUpdate(
    req,
    'Body has to be an array of more than one element.',
    'saving entities failed',
    (options: any) => Array.isArray(options) && options.length > 0
  );
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

export async function deleteEntities(req: Request): Promise<ApiResponse> {
  try {
    const { repo } = req.params;
    const options = req.body;

    if (!Array.isArray(options) || options.length === 0) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Body has to be an array of more than one element.',
        },
      };
    }

    const result = await AppDataSource.manager.delete(repo, options);

    if (!result.affected || result.affected === 0) {
      return {
        status: 500,
        body: {
          message: 'Entities not deleted. Who knows why?',
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
      body: { message: `Could not delete entities: ${err}` },
    };
  }
}

export function splitLegacyValueByCommaAndReturnUnique(
  commaSeparated: string
): string[] {
  if (!commaSeparated) {
    return [];
  }

  const uniqueValues = new Set(commaSeparated.split(','));
  return Array.from(uniqueValues);
}

export function removeQuotesFromLegacySearchParams(
  queryString: string
): string {
  return queryString.replace(/"]/g, '').replace(/%22/g, '');
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
      cache: true,
      relations: {
        platformProductVersions: {
          platform: true,
          product: true,
          version: true,
        },
        releases: true,
        subjects: true,
        language: true,
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
            docDisplayTitle: wrapInQuotes(docInfo.displayTitle),
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
            docSubjects: wrapInQuotes(
              docInfo.subjects.map((s: Subject) => s.name)
            ),
            docLanguage: docInfo.language.code,
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

function getUniqueVersions(
  allPlatformProductVersions: PlatformProductVersion[]
): string[] {
  const uniqueVersions = new Set<string>();
  allPlatformProductVersions.forEach((ppv) => {
    uniqueVersions.add(ppv.version.name);
  });
  return Array.from(uniqueVersions);
}

function getUniqueReleases(allReleases: Release[] | null): string[] {
  if (!allReleases) {
    return [];
  }

  const uniqueReleases = new Set<string>();
  allReleases.forEach((r) => {
    uniqueReleases.add(r.name);
  });
  return Array.from(uniqueReleases);
}

function getLabel(docConfig: Doc, releaseInLabel: boolean): string {
  const docReleases = getUniqueReleases(docConfig.releases);
  const docVersions = getUniqueVersions(docConfig.platformProductVersions);

  if (releaseInLabel && docReleases[0]) {
    return `${docReleases[0]} (${docVersions[0]})`;
  }

  return docVersions.join(',');
}

function sortVersions(
  unsortedVersions: Array<LegacyVersionObject>,
  releaseInLabel: boolean
): Array<LegacyVersionObject> {
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

export async function getVersionSelector(
  req: Request,
  res: Response
): Promise<ApiResponse> {
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
      .leftJoinAndSelect('doc.releases', 'docReleases')
      .leftJoinAndSelect('doc.language', 'docLanguage');
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
      .cache(true)
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
        .andWhere('docLanguage.code = :languageCode', {
          languageCode: docResponse.language.code,
        })
        .cache(true)
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
          versions: getUniqueVersions(doc.platformProductVersions),
          releases: getUniqueReleases(doc.releases),
          url: doc.url,
          label: getLabel(doc, useReleaseForLabel),
        };
      });
      const allVersions = [
        {
          versions: getUniqueVersions(docResponse.platformProductVersions),
          releases: getUniqueReleases(docResponse.releases),
          url: docResponse.url,
          currentlySelected: true,
          label: getLabel(docResponse, useReleaseForLabel),
        },
        ...otherVersions,
      ];

      if (allVersions.length < 2) {
        return {
          status: 200,
          body: { matchingVersionSelector: {} },
        };
      }

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

export async function getRootBreadcrumbs(
  pagePathname: string,
  res: Response
): Promise<ApiResponse> {
  const emptyRootPageResponse = {
    status: 200,
    body: {
      rootPages: [],
    },
  };
  try {
    if (!pagePathname) {
      return {
        status: 400,
        body: {
          message:
            'Invalid request. Provide the "pagePathname" query parameter to get the root breadcrumbs.',
        },
      };
    }
    const response = await fetch(
      `${process.env.FRONTEND_URL}/root-breadcrumbs.json`
    );
    if (!response.ok) {
      return emptyRootPageResponse;
    }
    const breadcrumbsJson = await response.json();
    const docEntity = await getDocByUrl(pagePathname);
    if (!docEntity) {
      return emptyRootPageResponse;
    }
    const matchingBreadcrumb = breadcrumbsJson.find(
      (b: { docId: string; rootPages: string[] }) => b.docId === docEntity.id
    );
    if (!matchingBreadcrumb) {
      return emptyRootPageResponse;
    }

    const validCrumbs = await Promise.all(
      matchingBreadcrumb.rootPages
        .map(async (matchingRootPage: string) => {
          const findEntityResult = await findEntity(
            Page.name,
            {
              path: matchingRootPage.replace(/^\//g, ''),
            },
            false
          );

          if (findEntityResult) {
            const isUserAllowedToAccessResourceResult =
              isUserAllowedToAccessResource(
                res,
                findEntityResult.public,
                findEntityResult.internal,
                findEntityResult.isInProduction
              );
            if (isUserAllowedToAccessResourceResult.status === 200) {
              return {
                path: matchingRootPage,
                label: findEntityResult.title,
              };
            }
          }
        })
        .filter(Boolean)
    );
    if (validCrumbs.length > 0) {
      return {
        status: 200,
        body: {
          rootPages: validCrumbs,
        },
      };
    }

    return emptyRootPageResponse;
  } catch (err) {
    winstonLogger.error(
      `Problem getting root breadcrumbs for page: "${pagePathname}":
          ERROR: ${err}`
    );
    return emptyRootPageResponse;
  }
}

function getPublicSettingFromUnionType(
  item: Doc | Page | ExternalLink
): boolean {
  if (
    'ignorePublicPropertyAndUseVariants' in item &&
    item.ignorePublicPropertyAndUseVariants === true
  ) {
    // if ignorePublicPropertyAndUseVariants exists (meaning, it's a Doc type item)
    // and the value is set to `true`, use this value
    return true;
  }

  // otherwise, use the value of the `public` prop
  return item.public;
}

function getAllowedResources(
  items: (Doc | Page | ExternalLink)[],
  res: Response
): (Doc | Page | ExternalLink)[] {
  return items.filter((item) => {
    const isPublic = getPublicSettingFromUnionType(item);
    return (
      isUserAllowedToAccessResource(
        res,
        isPublic,
        item.internal,
        item.isInProduction
      ).status === 200
    );
  });
}

export async function getPageItems(
  req: Request,
  res: Response
): Promise<ApiResponse> {
  try {
    const pageItemsResult: PageItemsResponse = {
      docs: [],
      pages: [],
      externalLinks: [],
    };
    const { docIds, pagePaths, externalLinkUrls }: PageItemsRequestBody =
      req.body;

    if (docIds.length > 0) {
      const findDocsResult: Doc[] = await AppDataSource.manager.find(Doc, {
        where: { id: In(docIds) },
        cache: true,
      });
      if (findDocsResult.length > 0) {
        pageItemsResult.docs = getAllowedResources(
          findDocsResult,
          res
        ) as Doc[];
      }
    }
    if (pagePaths.length > 0) {
      const findPagesResult: Page[] = await AppDataSource.manager.find(Page, {
        where: { path: In(pagePaths) },
        cache: true,
      });
      if (findPagesResult.length > 0) {
        pageItemsResult.pages = getAllowedResources(
          findPagesResult,
          res
        ) as Page[];
      }
    }
    if (externalLinkUrls.length > 0) {
      const findExternalLinksResult: ExternalLink[] =
        await AppDataSource.manager.find(ExternalLink, {
          where: { url: In(externalLinkUrls) },
          cache: true,
        });
      if (findExternalLinksResult.length > 0) {
        pageItemsResult.externalLinks = getAllowedResources(
          findExternalLinksResult,
          res
        ) as ExternalLink[];
      }
    }

    if (Object.values(pageItemsResult).flat().length === 0) {
      return {
        status: 404,
        body: {
          message: `Did not find entities in the Doc, Page, and ExternalLink repos`,
        },
      };
    }
    return {
      status: 200,
      body: pageItemsResult,
    };
  } catch (err) {
    return {
      status: 500,
      body: { message: `Operation failed: ${err}` },
    };
  }
}
