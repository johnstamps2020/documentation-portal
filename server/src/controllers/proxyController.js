'use strict';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

function setProxyResCacheControlHeader(proxyRes) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

proxy.on('error', function(err) {
  next(err);
});

function s3Proxy(req, res, next) {
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

function html5Proxy(req, res, next) {
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

function portal2Proxy(req, res, next) {
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

function reactAppProxy(req, res, next) {
  console.log('Calling the PROD landing page proxy');
  proxy.web(
    req,
    res,
    {
      target: `${process.env.DOC_S3_URL}/landing-pages-react`,
      changeOrigin: true,
    },
    next
  );
}

function reactDevProxy(req, res, next) {
  console.log('Calling the DEV landing page proxy');
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
