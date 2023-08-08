import { NextFunction, Request, Response } from 'express';
import { getDocByUrl } from './configController';
import {
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { htmlPageExists, isHtmlRequest } from './redirectController';

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

export async function s3Proxy(req: Request, res: Response, next: NextFunction) {
  const requestedPath: string = req.path;
  const requestedDoc = await getDocByUrl(requestedPath.replace(/^\//, ''));
  if (requestedDoc) {
    const resourceStatus = isUserAllowedToAccessResource(
      res,
      requestedDoc.public,
      requestedDoc.internal,
      requestedDoc.isInProduction
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
      const pathExists = await htmlPageExists(requestedPath);
      if (!pathExists) {
        return res.redirect(`/${requestedDoc.url}`);
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
