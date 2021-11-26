const fs = require('fs');
const path = require('path');
const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');

function setL10nParams(pageClass) {
  let ns = {};
  ns.placeholder = 'Search';
  ns.lang = 'en';
  if (pageClass) {
    if (pageClass.includes('l10n')) {
      {
        if (pageClass.includes(' de-DE ')) {
          {
            ns.placeholder = 'Suche';
            ns.lang = 'de';
          }
          if (pageClass.includes(' fr-FR ')) {
            {
              ns.placeholder = 'Chercher';
              ns.lang = 'fr';
            }
            if (pageClass.includes(' es-ES ')) {
              {
                ns.placeholder = 'Buscar';
                ns.lang = 'es';
              }
              if (pageClass.includes(' es-LA ')) {
                ns.placeholder = 'Buscar';
                ns.lang = 'es';
              }
              if (pageClass.includes(' it-IT ')) {
                ns.placeholder = 'Ricerca';
                ns.lang = 'it';
              }
              if (pageClass.includes(' ja-JP ')) {
                ns.placeholder = '探す';
                ns.lang = 'ja';
              }
              if (pageClass.includes(' nl-NL ')) {
                ns.placeholder = 'Zoeken';
                ns.lang = 'nl';
              }
              if (pageClass.includes(' pt-BR ')) {
                ns.placeholder = 'Procurar';
                ns.lang = 'pt';
              }
              if (pageClass.includes(' ru ')) {
                ns.placeholder = 'Поиск';
                ns.lang = 'ru';
              }
            }
          }
        }
      }
    }
  }
  return ns;
}

async function getPage(req, res, next) {
  const configFilePath = path.join(staticPagesDir, req.path, 'index.json');
  const configFileExists = fs.existsSync(configFilePath);
  if (configFileExists) {
    const fileContents = fs.readFileSync(configFilePath, 'utf-8');
    const fileContentsJson = JSON.parse(fileContents);
    const templateName = fileContentsJson.template;
    res.render(templateName, {
      pageConfig: fileContentsJson,
      pagePath: req.path,
      ns: setL10nParams(fileContentsJson.class),
    });
  } else {
    next();
  }
}

module.exports = { getPage };
