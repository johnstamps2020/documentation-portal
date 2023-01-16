import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { getDocByUrl, getPage } from './configController';
import {
  isUserAllowedToAccessResource,
  openRequestedUrl,
  redirectToLoginPage,
} from './authController';
import { runningInDevMode } from './utils/serverUtils';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();
export const forbiddenRoute = '/landing/forbidden';

function setProxyResCacheControlHeader(proxyRes: any) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

proxy.on('error', function(err: any, next: NextFunction) {
  next(err);
});

export async function s3Proxy(req: Request, res: Response, next: NextFunction) {
  let resourceStatus;
  if (req.path.startsWith('/sitemap')) {
    resourceStatus = await isUserAllowedToAccessResource(
      req,
      false,
      false
    ).then(r => r.status);
  } else {
    const requestedDoc = await getDocByUrl(req.path);
    if (!requestedDoc) {
      return next();
    }
    resourceStatus = await isUserAllowedToAccessResource(
      req,
      requestedDoc.public,
      requestedDoc.internal
    ).then(r => r.status);
  }
  if (resourceStatus === 401) {
    return redirectToLoginPage(req, res);
  }
  if (resourceStatus == 403) {
    return res.redirect(
      `${forbiddenRoute}${req.url ? `?unauthorized=${req.url}` : ''}`
    );
  }

  openRequestedUrl(req, res);
  let proxyTarget;
  if (req.path.startsWith('/sitemap')) {
    proxyTarget = `${process.env.DOC_S3_URL}/sitemap`;
  } else {
    proxyTarget = req.path.startsWith('/portal')
      ? process.env.PORTAL2_S3_URL
      : process.env.DOC_S3_URL;
  }
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
  if (req.path === '/') {
    return proxy.web(req, res, proxyOptions, next);
  }
  const requestedPage = await getPage(req);
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
    return redirectToLoginPage(req, res);
  }
  if (checkStatus == 403) {
    return res.redirect(
      `${forbiddenRoute}${req.url ? `?unauthorized=${req.url}` : ''}`
    );
  }

  openRequestedUrl(req, res);
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
