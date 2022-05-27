'use strict';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

proxy.on('error', function(err) {
  next(err);
});

function s3Proxy(req, res, next) {
  proxy.web(
    req,
    res,
    {
      target: `${process.env.DOC_S3_URL}`,
      changeOrigin: true,
    },
    next
  );
}

function portal2Proxy(req, res, next) {
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

module.exports = {
  s3Proxy,
  portal2Proxy,
};
