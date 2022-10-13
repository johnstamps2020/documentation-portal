import { winstonLogger } from './loggerController';
import fetch from 'node-fetch';
import { Request } from 'express';
import { PageConfig } from '../model/entity/PageConfig';

function getMockLanguages() {
  return ['Dothraki', 'Klingon', 'Fremeni', 'Minion', 'Polish'].map(
    language => ({
      label: language,
      pageUrl: '/',
    })
  );
}

export async function isPageAndIsInternal(req: Request): Promise<boolean> {
  // TO DO: check page path, see if it's set to "internal"
  winstonLogger.error('isPageAndIsInternal: FUNCTION NOT IMPLEMENTED!!!');
  return new Promise(resolve => resolve(false));
}

export async function getTranslatedPages() {
  try {
    const rootTranslatedPageConfigFilePath = new URL(
      `pages/l10n/index.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(rootTranslatedPageConfigFilePath);
    if (response.ok) {
      const pageConfig: PageConfig = await response.json();
      return pageConfig.items.map(o => ({
        label: o.label,
        pageUrl: `/l10n/${o.page}`,
      }));
    } else {
      return getMockLanguages();
    }
  } catch (err) {
    winstonLogger.error(
      `Cannot get translated pages
          ERROR: ${JSON.stringify(err)}`
    );
  }
}
