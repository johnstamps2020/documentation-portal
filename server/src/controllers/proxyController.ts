import { NextFunction, Request, Response } from 'express';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

export const fourOhFourRoute = '/landing/404';
export const forbiddenRoute = '/landing/forbidden';
export const internalRoute = '/landing/internal';

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
  proxy.on('proxyRes', setProxyResCacheControlHeader);
  proxy.web(
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

export async function reactAppProxy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const proxyOptions = {
    target: `${process.env.FRONTEND_URL}/landing`,
    changeOrigin: true,
  };
  return proxy.web(req, res, proxyOptions, next);
}
