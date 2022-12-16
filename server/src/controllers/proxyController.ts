import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { getDocByUrl, getEntity } from './configController';
import {
  isUserAllowedToAccessResource,
  loginGatewayRoute,
} from './authController';
import { Page } from '../model/entity/Page';

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
  const userIsAllowedToAccessResource = await isUserAllowedToAccessResource(
    req,
    requestedDoc.public,
    requestedDoc.internal
  );
  if (!userIsAllowedToAccessResource) {
    return res.redirect(loginGatewayRoute);
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

function portal2Proxy(req: Request, res: Response, next: NextFunction) {
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

function reactAppProxy(req: Request, res: Response, next: NextFunction) {
  const reactAppRoot = `${process.env.DOC_S3_URL}/landing-pages-react`;
  if (!req.url.match(/[a-zA-Z0-9]\.[a-zA-Z0-9]+$/)) {
    fetch(`${reactAppRoot}/index.html`)
      .then(response => {
        res.status(getStatusCode(req.url));
        response.body.pipe(res);
      })
      .catch(err => res.status(500).send(err));
  } else {
    proxy.web(
      req,
      res,
      {
        target: reactAppRoot,
        changeOrigin: true,
      },
      next
    );
  }
}

async function reactDevProxy(req: Request, res: Response, next: NextFunction) {
  const proxyOptions = {
    target: `http://localhost:6006/landing`,
    changeOrigin: true,
  };
  if (req.originalUrl === loginGatewayRoute || req.path.startsWith('/static')) {
    return proxy.web(req, res, proxyOptions, next);
  }
  const requestedPage = await getEntity(Page.name, {
    path: req.path.replace(/^\//g, ''),
  });
  if (!requestedPage) {
    return next();
  }
  const requestedPageBody = requestedPage.body;
  const userIsAllowedToAccessResource = await isUserAllowedToAccessResource(
    req,
    requestedPageBody.public,
    requestedPageBody.internal
  );
  if (!userIsAllowedToAccessResource) {
    return res.redirect(loginGatewayRoute);
  }
  proxy.web(req, res, proxyOptions, next);
}

module.exports = {
  s3Proxy,
  html5Proxy,
  portal2Proxy,
  reactAppProxy,
  reactDevProxy,
};
