import { winstonLogger } from './loggerController';
import fetch from 'node-fetch';
import { NextFunction, Request, Response } from 'express';
import { PageConfig } from '../model/entity/PageConfig';

function getMockLanguages() {
  return ['Dothraki', 'Klingon', 'Fremeni', 'Minion', 'Polish'].map(
    language => ({
      label: language,
      pageUrl: '/',
    })
  );
}

type L10N = {
  placeholder: string;
  lang: string;
};

type l10NMapping = {
  [x: string]: L10N;
};

const l10nMappings: l10NMapping = {
  'de-DE': {
    placeholder: 'Suche',
    lang: 'de',
  },

  'fr-FR': {
    placeholder: 'Chercher',
    lang: 'fr',
  },

  'es-ES': {
    placeholder: 'Buscar',
    lang: 'es',
  },
  'es-LA': {
    placeholder: 'Buscar',
    lang: 'es',
  },
  'it-IT': {
    placeholder: 'Ricerca',
    lang: 'it',
  },
  'ja-JP': {
    placeholder: '探す',
    lang: 'ja',
  },
  'nl-NL': {
    placeholder: 'Zoeken',
    lang: 'nl',
  },
  'pt-BR': {
    placeholder: 'Procurar',
    lang: 'pt',
  },
  ru: {
    placeholder: 'Поиск',
    lang: 'ru',
  },
};

function setL10nParams(pageClass: string): L10N {
  let l10n: L10N = {
    placeholder: 'Search',
    lang: 'en',
  };

  for (const key of Object.keys(l10nMappings)) {
    if (pageClass.split(' ').includes(key)) {
      return l10nMappings[key];
    }
  }

  return {
    placeholder: 'Search',
    lang: 'en',
  };
}

export async function fetchConfigFileForLandingPage(req: Request) {
  let reqPath = req.path === '/' ? '' : req.path;
  if (reqPath.slice(-1) === '/') {
    reqPath = reqPath.slice(0, -1);
  }

  const configFilePath = new URL(
    `pages${reqPath}/index.json`,
    process.env.DOC_S3_URL
  ).href;
  return await fetch(configFilePath);
}

export async function getPage(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await fetchConfigFileForLandingPage(req);
    if (response.ok) {
      const pageConfig: PageConfig = await response.json();
      const hasGuidewireEmail = res.locals.userInfo.hasGuidewireEmail;
      const templateName =
        hasGuidewireEmail && pageConfig.template === 'page'
          ? 'react-page'
          : pageConfig.template;
      res.render(templateName, {
        pageContent: pageConfig,
        deploymentEnv: process.env.DEPLOY_ENV,
        hasGuidewireEmail: hasGuidewireEmail,
        pagePath: req.path.endsWith('/') ? req.path : `${req.path}/`,
        localizationInfo: setL10nParams(pageConfig.class),
      });
    } else {
      next();
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting path for "${req.path}"
          ERROR: ${JSON.stringify(err)}`
    );
  }
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
