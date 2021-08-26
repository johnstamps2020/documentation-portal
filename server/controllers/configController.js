const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const localConfigDir = path.resolve(`${__dirname}/../../.teamcity/config/docs`);
const breadcrumbsConfigPath = path.resolve(
  `${__dirname}/../static/pages/breadcrumbs.json`
);
const versionSelectorsConfigPath = path.resolve(
  `${__dirname}/../static/pages/versionSelectors.json`
);

async function getConfig(reqObj) {
  try {
    let config;
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local config for the "${process.env.DEPLOY_ENV}" environment`
      );

      function readFilesInDir(dirPath) {
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
      }

      config = readFilesInDir(localConfigDir);
    } else {
      const result = await fetch(
        `${process.env.DOC_S3_URL}/portal-config/config.json`
      );
      config = await result.json();
    }
    if (!reqObj.session.requestIsAuthenticated) {
      config['docs'] = config.docs.filter(d => d.public === true);
    }
    return config;
  } catch (err) {
    console.log(err);
    return { docs: [] };
  }
}

async function isPublicDoc(url, reqObj) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = await getConfig(reqObj);
  const matchingDoc = config.docs.find(d =>
    relativeUrl.startsWith(d.url + '/')
  );

  return !!(matchingDoc && matchingDoc.public);
}

async function getRootBreadcrumb(pagePathname) {
  try {
    const breadcrumbsFile = fs.readFileSync(breadcrumbsConfigPath, 'utf-8');
    const breadcrumbsMapping = JSON.parse(breadcrumbsFile);
    for (breadcrumb of breadcrumbsMapping) {
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
    return { rootPage: {} };
  } catch (err) {
    console.log(err);
    return { rootPage: {} };
  }
}

async function getVersionSelector(platform, product, version, reqObj) {
  try {
    const versionSelectorsFile = fs.readFileSync(
      versionSelectorsConfigPath,
      'utf-8'
    );
    const versionSelectorMapping = JSON.parse(versionSelectorsFile);
    const matchingVersionSelector = versionSelectorMapping.find(
      s =>
        product.split(',').some(p => p === s.product) &&
        platform.split(',').some(pl => pl === s.platform) &&
        version.split(',').some(v => v === s.version)
    );
    //The getConfig function checks if request is authenticated and filters the returned docs accordingly.
    //Therefore, for the selector it's enough to check if a particular version has a doc in the returned config.
    const config = await getConfig(reqObj);
    const docs = config.docs;
    matchingVersionSelector[
      'otherVersions'
    ] = matchingVersionSelector.otherVersions.filter(v =>
      docs.find(d => `/${d.url}` === v.path)
    );
    return { matchingVersionSelector: matchingVersionSelector };
  } catch (err) {
    console.log(err);
    return { matchingVersionSelector: {} };
  }
}

async function getDocumentMetadata(docId, reqObj) {
  const config = await getConfig(reqObj);
  const doc = config.docs.find(d => d.id === docId);
  if (doc) {
    return {
      docTitle: doc.title,
      ...doc.metadata,
    };
  } else {
    return {
      error: true,
      message: `Did not find a doc matching ID ${docId}`,
    };
  }
}

module.exports = {
  getConfig,
  isPublicDoc,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
};
