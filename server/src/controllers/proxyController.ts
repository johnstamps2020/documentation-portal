import { NextFunction, Request, Response } from 'express';
import {
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { getDocByUrl, getExternalLinkByUrl } from './configController';
import {
  addPrecedingSlashToPath,
  s3BucketUrlExists,
} from './redirectController';
import { Doc } from '../model';

const fetch = require('node-fetch-retry');

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

export const fourOhFourRoute = '/404';
export const internalRoute = '/internal';

function setProxyResCacheControlHeader(proxyRes: any) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

proxy.on('error', function (err: any, next: NextFunction) {
  next(err);
});

export async function sitemapProxy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  proxy.web(
    req,
    res,
    {
      target: `${process.env.DOC_S3_URL}/sitemap/${req.originalUrl}`,
      changeOrigin: true,
      ignorePath: true,
    },
    next
  );
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

  const dbEntityUrl = dbEntity.url;
  // Check explicitly if the ignorePublicPropertyAndUseVariants property is set to True
  // not to include any truthy values.
  if (
    dbEntity instanceof Doc &&
    dbEntity.ignorePublicPropertyAndUseVariants === true
  ) {
    const cleanedRequestedPath = requestedPath
      .replace(publicSubPath, '')
      .replace(restrictedSubPath, '');
    const requstedPathNeedsTrailingSlash = checkIfPathNeedsTrailingSlash(
      cleanedRequestedPath,
      htmlRequest
    );

    if (requestedPath !== cleanedRequestedPath) {
      requstedPathNeedsTrailingSlash
        ? res.redirect(`${cleanedRequestedPath}/`)
        : res.redirect(cleanedRequestedPath);
    }
    if (requstedPathNeedsTrailingSlash) {
      res.redirect(`${cleanedRequestedPath}/`);
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

function isPrPreviewLink(requestedPath: string): boolean {
  const pathSegments = requestedPath.split('/');
  return (
    pathSegments.includes('preview') &&
    pathSegments.includes('pull-requests') &&
    pathSegments.includes('from') &&
    pathSegments.includes('refs')
  );
}

async function getResourceStatus(
  requestedPath: string,
  htmlRequest: boolean,
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  if (isPrPreviewLink(requestedPath)) {
    return [
      isUserAllowedToAccessResource(res, false, true, false).status,
      undefined,
    ];
  }

  return getResourceStatusFromDatabase(requestedPath, htmlRequest, res);
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

  const [resourceStatus, redirectPath] = await getResourceStatus(
    requestedPath,
    isHtmlRequest,
    res
  );
  if (resourceStatus === 100) {
    return next();
  }

  if (resourceStatus === 401) {
    return redirectToLoginPage(req, res);
  }

  if (resourceStatus == 403) {
    return res.redirect(
      `${internalRoute}${req.url ? `?restricted=${req.originalUrl}` : ''}`
    );
  }

  if (resourceStatus === 307 && redirectPath) {
    return res.redirect(redirectPath);
  }

  if ([404, 406].includes(resourceStatus)) {
    return res.redirect(
      `${fourOhFourRoute}${req.url ? `?notFound=${req.originalUrl}` : ''}`
    );
  }

  const docPath = redirectPath === undefined ? requestedPath : redirectPath;

  openRequestedUrl(req, res);
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  return proxy.web(
    req,
    res,
    {
      target: requestedPath.startsWith('/portal')
        ? `${process.env.PORTAL2_S3_URL}${requestedPath}`
        : `${process.env.DOC_S3_URL}${docPath}`,
      changeOrigin: true,
      ignorePath: true,
    },
    next
  );
}

export function html5Proxy(req: Request, res: Response, next: NextFunction) {
  proxy.web(
    req,
    res,
    {
      target: `${process.env.DOC_S3_URL}/html5/scripts`,
      changeOrigin: true,
    },
    next
  );
}

export async function reactAppProxy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const proxyOptions = {
    target: process.env.FRONTEND_URL,
    changeOrigin: true,
  };
  return proxy.web(req, res, proxyOptions, next);
}
