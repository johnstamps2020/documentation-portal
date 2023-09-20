import { NextFunction, Request, Response } from 'express';
import { Doc } from '../model/entity/Doc';
import {
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { getDocByUrl, getExternalLinkByUrl } from './configController';
import { isHtmlRequest, s3BucketUrlExists } from './redirectController';

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
      target: `${process.env.DOC_S3_URL}/sitemap`,
      changeOrigin: true,
    },
    next
  );
}

type ResourceStatusWithRedirectLink = [number, string | undefined];

async function getResourceStatusFromDatabase(
  requestedPath: string,
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  const requestedEntity =
    (await getExternalLinkByUrl(requestedPath)) ||
    (await getDocByUrl(requestedPath));

  if (!requestedEntity) {
    return [100, undefined];
  }

  const requestedEntityFullUrl =
    requestedEntity instanceof Doc
      ? `/${requestedEntity.url}`
      : requestedEntity.url;
  const requestedEntityUrlExists = await s3BucketUrlExists(
    requestedEntityFullUrl
  );

  if (!requestedEntityUrlExists) {
    return [100, undefined];
  }

  if (isHtmlRequest(requestedPath)) {
    const requestedPathExists = await s3BucketUrlExists(requestedPath);
    if (!requestedPathExists) {
      return [307, requestedEntityFullUrl];
    }
  }

  return [
    isUserAllowedToAccessResource(
      res,
      requestedEntity.public,
      requestedEntity.internal,
      requestedEntity.isInProduction
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
  res: Response
): Promise<ResourceStatusWithRedirectLink> {
  if (isPrPreviewLink(requestedPath)) {
    return [
      isUserAllowedToAccessResource(res, false, true, false).status,
      undefined,
    ];
  }

  return getResourceStatusFromDatabase(requestedPath, res);
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

  const [resourceStatus, redirectPath] = await getResourceStatus(
    requestedPath,
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

  openRequestedUrl(req, res);
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  return proxy.web(
    req,
    res,
    {
      target: requestedPath.startsWith('/portal')
        ? process.env.PORTAL2_S3_URL
        : process.env.DOC_S3_URL,
      changeOrigin: true,
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
