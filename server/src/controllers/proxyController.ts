'use strict';

import { NextFunction, Request, Response } from 'express';

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

function s3Proxy(req: Request, res: Response, next: NextFunction) {
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

function reactAppProxy(req: Request, res: Response, next: NextFunction) {
  const reactAppRoot = `${process.env.DOC_S3_URL}/landing-pages-react`;
  proxy.web(
    req,
    res,
    {
      target: reactAppRoot,
      changeOrigin: true,
    },
    next
  );

  res.sendFile(`${reactAppRoot}/index.html`);
}

function reactDevProxy(req: Request, res: Response, next: NextFunction) {
  proxy.web(
    req,
    res,
    {
      target: `http://localhost:5000/landing`,
      changeOrigin: true,
    },
    next
  );
}

module.exports = {
  s3Proxy,
  html5Proxy,
  portal2Proxy,
  reactAppProxy,
  reactDevProxy,
};
