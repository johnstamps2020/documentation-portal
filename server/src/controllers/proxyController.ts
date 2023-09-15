import { NextFunction, Request, Response } from 'express';
import { getDocByUrl, getExternalLinkByUrl } from './configController';
import {
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { isHtmlRequest, s3BucketUrlExists } from './redirectController';
import { Doc } from '../model/entity/Doc';

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

/*
 The s3 proxy controller tries to find an external link first because external links are more specific than docs.
 If the function tries to find a doc by the requested URL first,
 it sometimes finds a match for the requested external link.
 For example, a request for the "/hazardhub/HazardHub_Intro_gw.pdf" external link
 matches the doc with the "hazardhub" url.
 */
export async function s3Proxy(req: Request, res: Response, next: NextFunction) {
  const requestedPath: string = req.path;
  const requestedEntity =
    (await getExternalLinkByUrl(requestedPath)) ||
    (await getDocByUrl(requestedPath));
  if (requestedEntity) {
    const requestedEntityFullUrl =
      requestedEntity instanceof Doc
        ? `/${requestedEntity.url}`
        : requestedEntity.url;
    const requestedEntityUrlExists = await s3BucketUrlExists(
      requestedEntityFullUrl
    );
    if (!requestedEntityUrlExists) {
      return next();
    }
    const resourceStatus = isUserAllowedToAccessResource(
      res,
      requestedEntity.public,
      requestedEntity.internal,
      requestedEntity.isInProduction
    ).status;
    if (resourceStatus === 401) {
      return redirectToLoginPage(req, res);
    }
    if (resourceStatus == 403) {
      return res.redirect(
        `${internalRoute}${req.url ? `?restricted=${req.originalUrl}` : ''}`
      );
    }

    if (isHtmlRequest(requestedPath)) {
      const requestedPathExists = await s3BucketUrlExists(requestedPath);
      if (!requestedPathExists) {
        return res.redirect(requestedEntityFullUrl);
      }
    }

    openRequestedUrl(req, res);
    proxy.on('proxyRes', setProxyResCacheControlHeader);
    return proxy.web(
      req,
      res,
      {
        target: req.path.startsWith('/portal')
          ? process.env.PORTAL2_S3_URL
          : process.env.DOC_S3_URL,
        changeOrigin: true,
      },
      next
    );
  }
  return next();
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
