import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { getDocByUrl, findEntity } from './configController';
import {
  isUserAllowedToAccessResource,
  loginGatewayRoute,
  forbiddenRoute,
} from './authController';
import { Page } from '../model/entity/Page';
import { runningInDevMode } from './utils/serverUtils';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

function setProxyResCacheControlHeader(proxyRes: any) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

proxy.on('error', function(err: any, next: NextFunction) {
  next(err);
});

async function s3Proxy(req: Request, res: Response, next: NextFunction) {
  const requestedDoc = await getDocByUrl(req.path);
  if (!requestedDoc) {
    return next();
  }
  const checkStatus = await isUserAllowedToAccessResource(
    req,
    requestedDoc.public,
    requestedDoc.internal
  ).then(r => r.status);
  if (checkStatus === 401) {
    return res.redirect(loginGatewayRoute);
  }
  if (checkStatus == 403) {
    return res.redirect(forbiddenRoute);
  }
  const proxyTarget = req.path.startsWith('/sitemap')
    ? `${process.env.DOC_S3_URL}/sitemap`
    : process.env.DOC_S3_URL;
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  proxy.web(
    req,
    res,
    {
      target: proxyTarget,
      changeOrigin: true,
    },
    next
  );
}

function html5Proxy(req: Request, res: Response, next: NextFunction) {
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

async function portal2Proxy(req: Request, res: Response, next: NextFunction) {
  const requestedDoc = await getDocByUrl(`portal${req.path}`);
  if (!requestedDoc) {
    return next();
  }
  const checkStatus = await isUserAllowedToAccessResource(
    req,
    requestedDoc.public,
    requestedDoc.internal
  ).then(r => r.status);
  if (checkStatus === 401) {
    return res.redirect(loginGatewayRoute);
  }
  if (checkStatus == 403) {
    return res.redirect(forbiddenRoute);
  }
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  proxy.web(
    req,
    res,
    {
      target: `${process.env.PORTAL2_S3_URL}/portal`,
      changeOrigin: true,
    },
    next
  );
}

function getStatusCode(reqUrl: string): number {
  const matches: {
    snippet: string;
    code: number;
  }[] = [
    {
      snippet: 'unauthorized',
      code: 401,
    },
    {
      snippet: '404',
      code: 404,
    },
    {
      snippet: 'error',
      code: 500,
    },
  ];

  for (const match of matches) {
    if (
      reqUrl.endsWith(`/${match.snippet}`) ||
      reqUrl.endsWith(`/${match.snippet}/`)
    ) {
      return match.code;
    }
  }

  return 200;
}

async function reactAppProxy(req: Request, res: Response, next: NextFunction) {
  const isDevMode = runningInDevMode();
  const proxyOptions = {
    target: isDevMode
      ? 'http://localhost:6006/landing'
      : `${process.env.DOC_S3_URL}/landing-pages-react`,
    changeOrigin: true,
  };
  if (req.originalUrl === loginGatewayRoute || req.path.startsWith('/static')) {
    return proxy.web(req, res, proxyOptions, next);
  }
  const requestedPage = await findEntity(Page.name, {
    path: req.path.replace(/^\//g, ''),
  });
  if (!requestedPage) {
    return next();
  }
  const requestedPageBody = requestedPage.body;
  const checkStatus = await isUserAllowedToAccessResource(
    req,
    requestedPageBody.public,
    requestedPageBody.internal
  ).then(r => r.status);
  if (checkStatus === 401) {
    return res.redirect(loginGatewayRoute);
  }
  if (checkStatus == 403) {
    return res.redirect(forbiddenRoute);
  }
  if (isDevMode) {
    return proxy.web(req, res, proxyOptions, next);
  } else {
    if (!req.url.match(/[a-zA-Z0-9]\.[a-zA-Z0-9]+$/)) {
      fetch(`${proxyOptions.target}/index.html`)
        .then(response => {
          res.status(getStatusCode(req.url));
          response.body.pipe(res);
        })
        .catch(err => res.status(500).send(err));
    } else {
      proxy.web(req, res, proxyOptions, next);
    }
  }
}

module.exports = {
  s3Proxy,
  html5Proxy,
  portal2Proxy,
  reactAppProxy,
};
