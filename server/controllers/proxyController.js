'use strict';

const HttpProxy = require('http-proxy');
const proxy = new HttpProxy();

function setResCacheControlHeader(proxyRes, req, res) {
  if (proxyRes.headers['content-type']?.includes('html')) {
    proxyRes.headers['Cache-Control'] = 'no-store';
  }
}

function interveneInBuffer() {}

const s3ProxyOptions = {
  target: `${process.env.DOC_S3_URL}`,
  changeOrigin: true,
  onProxyRes: setResCacheControlHeader,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};

function s3Proxy(req, res, next) {
  proxy.web(req, res, s3ProxyOptions, next);
}

const portal2ProxyOptions = {
  target: `${process.env.PORTAL2_S3_URL}`,
  changeOrigin: true,
  onProxyRes: setResCacheControlHeader,
  onOpen: proxySocket => {
    proxySocket.on('data', hybiParseAndLogMessage);
  },
};

function portal2Proxy(req, res, next) {
  proxy.web(req, res, portal2ProxyOptions, next);
}

module.exports = {
  s3Proxy,
  portal2Proxy,
};
