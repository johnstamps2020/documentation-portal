import { JSDOM } from 'jsdom';
import request from 'supertest';
import { getApp } from '../app';

export function getVirtualDocument(htmlString: string) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  return document;
}

export async function querySelectorFromEndpoint(
  url: string,
  querySelector: string
) {
  const app = await getApp();
  const response = await request(app).get(url);
  const htmlString = await response.text;
  const document = getVirtualDocument(htmlString);
  const element = document.querySelector(querySelector);
  return element;
}
