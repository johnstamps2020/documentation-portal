const fetch = require('node-fetch-retry');
const fs = require('fs');
const path = require('path');
const { winstonLogger } = require('./loggerController');

const localConfigDir = path.resolve(`${__dirname}/../../.teamcity/config/docs`);
const breadcrumbsConfigPath = path.resolve(
  `${__dirname}/../static/pages/breadcrumbs.json`
);
const versionSelectorsConfigPath = path.resolve(
  `${__dirname}/../static/pages/versionSelectors.json`
);

async function loadConfig() {
  try {
    let config;
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local config for the "${process.env.DEPLOY_ENV}" environment`
      );

      function readFilesInDir(dirPath) {
        try {
          const localConfig = { docs: [] };
          const itemsInDir = fs.readdirSync(dirPath);
          for (const item of itemsInDir) {
            const itemPath = path.join(dirPath, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
              localConfig['docs'].push(...readFilesInDir(itemPath));
            } else {
              const config = fs.readFileSync(itemPath, 'utf-8');
              const json = JSON.parse(config);
              const docs = json.docs.filter(d =>
                d.environments.includes(process.env.DEPLOY_ENV)
              );
              localConfig['docs'].push(...docs);
            }
          }
          return localConfig;
        } catch (funcErr) {
          throw new Error(
            `Cannot read config file from path: ${dirPath}: ${funcErr}`
          );
        }
      }

      config = readFilesInDir(localConfigDir);
    } else {
      try {
        const result = await fetch(
          `${process.env.DOC_S3_URL}/portal-config/config.json`, { retry: 5, pause: 1000,
          callback: retry => { console.log(`Retrying fetch of config.json: ${retry}`) } }
        );
        config = await result.json();
      } catch (s3err) {
        throw new Error(
          `Problem reading config from S3 ${process.env.DOC_S3_URL}: ${s3err}`
        );
      }
    }
    return config;
  } catch (err) {
    winstonLogger.error(err.stack);
    return { docs: [] };
  }
}

async function getConfig(reqObj, resObj) {
  try {
    const config = await loadConfig();
    const hasGuidewireEmail = resObj.locals.userInfo.hasGuidewireEmail;
    if (!reqObj.session.requestIsAuthenticated) {
      config['docs'] = config.docs.filter(d => d.public === true);
    }
    if (!hasGuidewireEmail) {
      config['docs'] = config.docs.filter(d => d.internal === false);
    }
    return config;
  } catch (err) {
    winstonLogger.error(err.stack);
    return { docs: [] };
  }
}

async function getDocByUrl(url) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = await loadConfig();
  return config.docs.find(d => relativeUrl.startsWith(d.url + '/'));
}

async function isPublicDoc(url, reqObj) {
  const matchingDoc = await getDocByUrl(url, reqObj);
  return !!(matchingDoc && matchingDoc.public);
}

async function isInternalDoc(url, reqObj) {
  const matchingDoc = await getDocByUrl(url, reqObj);
  return !!(matchingDoc && matchingDoc.internal);
}

async function getRootBreadcrumb(pagePathname) {
  try {
    const breadcrumbsFile = fs.readFileSync(breadcrumbsConfigPath, 'utf-8');
    try {
      const breadcrumbsMapping = JSON.parse(breadcrumbsFile);
      for (const breadcrumb of breadcrumbsMapping) {
        if (
          pagePathname.startsWith(breadcrumb.docUrl) &&
          breadcrumb.rootPages.length === 1
        ) {
          return {
            rootPage: {
              path: breadcrumb.rootPages[0].path,
              label: breadcrumb.rootPages[0].label,
            },
          };
        }
      }
    } catch (breadErr) {
      throw new Error(
        `Problem getting breadcrumb file for page: "${pagePathname}" from file "${breadcrumbsConfigPath}": ${breadErr}`
      );
    }
    return { rootPage: {} };
  } catch (err) {
    winstonLogger.error(err.stack);
    return { rootPage: {} };
  }
}

async function getVersionSelector(docId, reqObj, resObj) {
  try {
    try {
      const versionSelectorsFile = fs.readFileSync(
        versionSelectorsConfigPath,
        'utf-8'
      );
      const versionSelectorMapping = JSON.parse(versionSelectorsFile);
      const matchingVersionSelector = versionSelectorMapping.find(
        s => docId === s.docId
      );
      // The getConfig function checks if the request is authenticated and if the user has the Guidewire email,
      // and filters the returned docs accordingly.
      // Therefore, for the selector it's enough to check if a particular version has a doc in the returned config.
      const config = await getConfig(reqObj, resObj);
      const docs = config.docs;
      if (matchingVersionSelector) {
        matchingVersionSelector[
          'allVersions'
        ] = matchingVersionSelector.allVersions.filter(v =>
          docs.find(d => d.url === v.url)
        );
        return { matchingVersionSelector: matchingVersionSelector };
      } else {
        return { matchingVersionSelector: {} };
      }
    } catch (verSelectorErr) {
      throw new Error(
        `Problem getting version selector for docId: ${docId}: ${verSelectorErr}`
      );
    }
  } catch (err) {
    winstonLogger.error(err.stack);
    return { matchingVersionSelector: {} };
  }
}

async function getDocumentMetadata(docId, reqObj, resObj) {
  const config = await getConfig(reqObj, resObj);
  const doc = config.docs.find(d => d.id === docId);
  if (doc) {
    return {
      docTitle: doc.title,
      docInternal: doc.internal,
      docEarlyAccess: doc.earlyAccess,
      ...doc.metadata,
    };
  } else {
    return {
      error: true,
      message: `Did not find a doc matching ID ${docId}`,
    };
  }
}

async function getDocId(
  products,
  platforms,
  versions,
  title,
  url,
  reqObj,
  resObj
) {
  const config = await getConfig(reqObj, resObj);
  const doc = config.docs.find(
    s =>
      products.split(',').some(p => s.metadata.product.includes(p)) &&
      platforms.split(',').some(pl => s.metadata.platform.includes(pl)) &&
      versions.split(',').some(v => s.metadata.version.includes(v)) &&
      (title === s.title || !title) &&
      url.includes(s.url)
  );
  if (doc) {
    return {
      docId: doc.id,
    };
  } else {
    return {
      error: true,
      message: `Did not find a doc matching the provided info: ${products}, ${platforms}, ${versions}, ${title}, ${url}`,
    };
  }
}

module.exports = {
  getConfig,
  isPublicDoc,
  isInternalDoc,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
};
