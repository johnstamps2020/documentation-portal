const { winstonLogger } = require('./loggerController');
const fetch = require('node-fetch');

function getMockLanguages() {
  return ['Dothraki', 'Klingon', 'Fremeni', 'Minion', 'Polish'].map(
    language => ({
      label: language,
      pageUrl: '/',
    })
  );
}

function setL10nParams(pageClass) {
  let l10n = {};
  l10n.placeholder = 'Search';
  l10n.lang = 'en';
  if (pageClass) {
    if (pageClass.includes('l10n')) {
      {
        if (pageClass.includes(' de-DE ')) {
          {
            l10n.placeholder = 'Suche';
            l10n.lang = 'de';
          }
        }
        if (pageClass.includes(' fr-FR ')) {
          {
            l10n.placeholder = 'Chercher';
            l10n.lang = 'fr';
          }
        }
        if (pageClass.includes(' es-ES ')) {
          {
            l10n.placeholder = 'Buscar';
            l10n.lang = 'es';
          }
        }
        if (pageClass.includes(' es-LA ')) {
          l10n.placeholder = 'Buscar';
          l10n.lang = 'es';
        }
        if (pageClass.includes(' it-IT ')) {
          l10n.placeholder = 'Ricerca';
          l10n.lang = 'it';
        }
        if (pageClass.includes(' ja-JP ')) {
          l10n.placeholder = '探す';
          l10n.lang = 'ja';
        }
        if (pageClass.includes(' nl-NL ')) {
          l10n.placeholder = 'Zoeken';
          l10n.lang = 'nl';
        }
        if (pageClass.includes(' pt-BR ')) {
          l10n.placeholder = 'Procurar';
          l10n.lang = 'pt';
        }
        if (pageClass.includes(' ru ')) {
          l10n.placeholder = 'Поиск';
          l10n.lang = 'ru';
        }
      }
    }
  }
  return l10n;
}

async function fetchConfigFileForLandingPage(req) {
  let reqPath = req.path === '/' ? '' : req.path;
  if ( reqPath.slice(-1) === '/' ) {
      reqPath = reqPath.slice(0, -1);
  }

  const configFilePath = new URL(
    `pages${reqPath}/index.json`,
    process.env.DOC_S3_URL
  ).href;
  return await fetch(configFilePath);
}

async function getPage(req, res, next) {
  try {
    const response = await fetchConfigFileForLandingPage(req);
    if (response.ok) {
      const fileContentsJson = await response.json();
      const hasGuidewireEmail = res.locals.userInfo.hasGuidewireEmail;
      const templateName = fileContentsJson.template;
      res.render(templateName, {
        pageContent: fileContentsJson,
        hasGuidewireEmail: hasGuidewireEmail,
        pagePath: req.path.endsWith('/') ? req.path : `${req.path}/`,
        localizationInfo: setL10nParams(fileContentsJson.class),
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

async function getTranslatedPages() {
  try {
    const rootTranslatedPageConfigFilePath = new URL(
      `pages/l10n/index.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(rootTranslatedPageConfigFilePath);
    if (response.ok) {
      const fileContentsJson = await response.json();
      return fileContentsJson.items.map(o => ({
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

module.exports = {
  fetchConfigFileForLandingPage,
  getPage,
  getTranslatedPages,
};
