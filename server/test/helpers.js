const { JSDOM } = require('jsdom');
const request = require('supertest');
const app = require('../app');
const appRequest = request(app);

function getVirtualDocument(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  return document;
}

async function querySelectorFromEndpoint(url, querySelector) {
  const response = await appRequest.get(url);
  const htmlString = await response.text;
  const document = getVirtualDocument(htmlString);
  const element = document.querySelector(querySelector);
  return element;
}

module.exports = {
  app,
  appRequest,
  getVirtualDocument,
  querySelectorFromEndpoint,
};
