import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { runningInDevMode } from './utils/serverUtils';

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
  const isDevMode = runningInDevMode();
  const proxyOptions = {
    target: isDevMode
      ? 'http://localhost:6006/landing'
      : `${process.env.DOC_S3_URL}/landing-pages-react`,
    changeOrigin: true,
  };
  /* Open routes, such as /gw-login and /search, are configured in the database as public pages.
                                        Resource routes, such as /static and /landing-page-resource, are configured in the database
                                         as public pages with the "resource" component.
                                        This way, the user can view these routes without login.*/
  if (isDevMode) {
    return proxy.web(req, res, proxyOptions, next);
  } else {
    const indexOfExtension = req.url.lastIndexOf('.');
    const endsWithExtension =
      indexOfExtension !== -1
        ? /^\D+$/.test(req.url.substring(indexOfExtension))
        : false;

    if (endsWithExtension) {
      proxy.web(req, res, proxyOptions, next);
    } else {
      fetch(`${proxyOptions.target}/index.html`)
        .then((response) => {
          res.status(getStatusCode(req.url));
          response.body.pipe(res);
        })
        .catch((err) => res.status(500).send(err));
    }
  }
}
