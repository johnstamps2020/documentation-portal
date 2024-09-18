// noinspection RedundantIfStatementJS

import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import HttpProxy from 'http-proxy-node16';
import { Doc, ExternalLink } from '../model';
import {
  getTokenFromRequestHeader,
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { getDocByUrl, getExternalLinkByUrl } from './configController';
import { winstonLogger } from './loggerController';
import {
  addPrecedingSlashToPath,
  s3BucketUrlExists,
} from './redirectController';

const proxy = new HttpProxy({
  timeout: 85000,
  proxyTimeout: 85000,
});
winstonLogger.notice('Proxy created');

proxy.on('econnreset', (err: any, req, res, target) => {
  if (`${err}`.match('socket hang up')) {
    return res.end();
  }
  winstonLogger.error(`Proxy ECONNRESET error: ${err}`);
  res.end();
});
proxy.on('error', (err: any, req, res, target) => {
  winstonLogger.error(`Proxy error: ${err}`);
  res.end();
});

proxy.on('proxyRes', setProxyResCacheControlHeader);

export const fourOhFourRoute = '/404';
export const internalRoute = '/internal';

function setProxyResCacheControlHeader(proxyRes: any) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

type ResourceStatusWithRedirectLink = [number, string | undefined];

const publicSubPath = '/__public';
const restrictedSubPath = '/__restricted';

function checkIfPathNeedsTrailingSlash(reqPath: string, htmlRequest: boolean) {
  if (!htmlRequest) {
    return false;
  }
  if (['.html', '.htm', '/'].some((ext) => reqPath.endsWith(ext))) {
    return false;
  }
  return true;
}

async function getResourceStatusForEntityWithVariants(
  dbEntity: Doc | ExternalLink,
  requestedPath: string,
  htmlRequest: boolean,
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  const dbEntityUrl = dbEntity.url;
  const cleanedRequestedPath = requestedPath
    .replace(publicSubPath, '')
    .replace(restrictedSubPath, '');
  const requestedPathNeedsTrailingSlash = checkIfPathNeedsTrailingSlash(
    cleanedRequestedPath,
    htmlRequest
  );

  if (requestedPath !== cleanedRequestedPath) {
    if (requestedPathNeedsTrailingSlash) {
      return [307, `${cleanedRequestedPath}/`];
    }
    return [307, cleanedRequestedPath];
  }
  if (requestedPathNeedsTrailingSlash) {
    return [307, `${cleanedRequestedPath}/`];
  }
  const hasAccessToRestrictedDoc = isUserAllowedToAccessResource(
    res,
    false,
    dbEntity.internal,
    dbEntity.isInProduction
  ).status;

  const requestedPathWithRestrictedSubPath = cleanedRequestedPath.replace(
    dbEntityUrl,
    `${dbEntityUrl}${restrictedSubPath}`
  );

  const requestedPathWithPublicSubPath = cleanedRequestedPath.replace(
    dbEntityUrl,
    `${dbEntityUrl}${publicSubPath}`
  );

  const restrictedDocExists = await s3BucketUrlExists(
    requestedPathWithRestrictedSubPath
  );
  const publicDocExists = await s3BucketUrlExists(
    requestedPathWithPublicSubPath
  );

  if (hasAccessToRestrictedDoc !== 200 && !publicDocExists) {
    return [404, undefined];
  }

  if (hasAccessToRestrictedDoc !== 200 && publicDocExists) {
    return [200, requestedPathWithPublicSubPath];
  }

  if (hasAccessToRestrictedDoc === 200 && restrictedDocExists) {
    return [200, requestedPathWithRestrictedSubPath];
  }
  return [100, undefined];
}

async function getResourceStatusForEntity(
  dbEntity: Doc | ExternalLink,
  requestedPath: string,
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  const dbEntityUrl = dbEntity.url;
  const requestedPathExists = await s3BucketUrlExists(requestedPath);
  if (!requestedPathExists) {
    const requestedEntityUrlExists = await s3BucketUrlExists(dbEntityUrl);
    if (!requestedEntityUrlExists) {
      return [100, undefined];
    }
    const redirectUrl = addPrecedingSlashToPath(dbEntityUrl);
    return [307, redirectUrl];
  }

  return [
    isUserAllowedToAccessResource(
      res,
      dbEntity.public,
      dbEntity.internal,
      dbEntity.isInProduction
    ).status,
    undefined,
  ];
}

async function getResourcesStatusForPreviewEntity(
  dbEntity: Doc | ExternalLink,
  requestedPath: string,
  htmlRequest: boolean,
  res: Response
) {
  const accessToEntity = await getResourceStatusForEntity(
    dbEntity,
    requestedPath,
    res
  );
  if (accessToEntity[0] !== 100) {
    return accessToEntity;
  }

  return await getResourceStatusForEntityWithVariants(
    dbEntity,
    requestedPath,
    htmlRequest,
    res
  );
}

async function getResourceStatusFromDatabase(
  requestedPath: string,
  htmlRequest: boolean,
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  const dbEntity =
    (await getExternalLinkByUrl(requestedPath)) ||
    (await getDocByUrl(requestedPath));

  if (!dbEntity) {
    return [100, undefined];
  }

  if (dbEntity instanceof Doc && dbEntity.id === 'previews3folder') {
    return await getResourcesStatusForPreviewEntity(
      dbEntity,
      requestedPath,
      htmlRequest,
      res
    );
  }
  // Check explicitly if the ignorePublicPropertyAndUseVariants property is set to True
  // not to include any truthy values.
  if (
    dbEntity instanceof Doc &&
    dbEntity.ignorePublicPropertyAndUseVariants === true
  ) {
    return await getResourceStatusForEntityWithVariants(
      dbEntity,
      requestedPath,
      htmlRequest,
      res
    );
  }

  return await getResourceStatusForEntity(dbEntity, requestedPath, res);
}

export async function sitemapProxy(req: Request, res: Response) {
  return proxy.web(req, res, {
    target: `${process.env.DOC_S3_URL}/sitemap/${req.originalUrl}`,
    changeOrigin: true,
    ignorePath: true,
  });
}

/*
 The s3 proxy controller tries to find an external link first because external links are more specific than docs.
 If the function tries to find a doc by the requested URL first,
 it sometimes finds a match for the requested external link.
 For example, a request for the "/hazardhub/HazardHub_Intro_gw.pdf" external link
 matches the doc with the "hazardhub" url.
 */
export async function s3Proxy(req: Request, res: Response, next: NextFunction) {
  const requestedPath: string = req.path;
  const isHtmlRequest = req.headers['accept']?.includes('text/html') || false;

  const [resourceStatus, redirectPath] = await getResourceStatusFromDatabase(
    requestedPath,
    isHtmlRequest,
    res
  );

  const tokenFromHeader = getTokenFromRequestHeader(req);

  if (resourceStatus === 100) {
    return next();
  }

  if (resourceStatus === 401) {
    if (tokenFromHeader) {
      return res
        .status(resourceStatus)
        .send({ message: 'Unauthorized', token: tokenFromHeader });
    }

    return redirectToLoginPage(req, res);
  }

  if (resourceStatus == 403) {
    if (tokenFromHeader) {
      return res
        .status(resourceStatus)
        .send({ message: 'Forbidden', token: tokenFromHeader });
    }

    return res.redirect(
      `${internalRoute}${req.url ? `?restricted=${req.originalUrl}` : ''}`
    );
  }

  if (resourceStatus === 307 && redirectPath) {
    return res.redirect(redirectPath);
  }

  if ([404, 406].includes(resourceStatus)) {
    if (tokenFromHeader) {
      return res
        .status(404)
        .send({ message: 'Resource not found', requestedUrl: req.originalUrl });
    }

    return res.redirect(
      `${fourOhFourRoute}${req.url ? `?notFound=${req.originalUrl}` : ''}`
    );
  }

  const docPath = redirectPath === undefined ? requestedPath : redirectPath;

  openRequestedUrl(req, res);
  return proxy.web(req, res, {
    target: requestedPath.startsWith('/portal')
      ? `${process.env.PORTAL2_S3_URL}${requestedPath}`
      : `${process.env.DOC_S3_URL}${docPath}`,
    changeOrigin: true,
    ignorePath: true,
  });
}

export function html5Proxy(req: Request, res: Response) {
  return proxy.web(req, res, {
    target: `${process.env.DOC_S3_URL}/html5/scripts`,
    changeOrigin: true,
  });
}

export async function reactAppProxy(req: Request, res: Response) {
  return proxy.web(req, res, {
    target: process.env.FRONTEND_URL,
    changeOrigin: true,
    ws: true,
  });
}
