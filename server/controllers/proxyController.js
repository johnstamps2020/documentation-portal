'use strict';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

proxy.on('error', function(err) {
  next(err);
});

const s3ProxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
};

function s3Proxy(req, res, next) {
  proxy.web(req, res, s3ProxyOptions, next);
}

const portal2ProxyOptions = {
  target: `${process.env.PORTAL2_S3_URL}/portal`,
  changeOrigin: true,
};

function portal2Proxy(req, res, next) {
  proxy.on('error', function(err) {
    next(err);
  });
  proxy.web(req, res, portal2ProxyOptions, next);
}

module.exports = {
  s3Proxy,
  portal2Proxy,
};
