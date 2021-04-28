const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const localConfigDir = path.resolve(`${__dirname}/../../.teamcity/config`);
const breadcrumbsConfigPath = path.resolve(
  `${__dirname}/../static/pages/breadcrumbs.json`
);

async function getConfig() {
  try {
    if (process.env.LOCAL_CONFIG === 'yes') {
      console.log(
        `Getting local config for the "${process.env.DEPLOY_ENV}" environment`
      );
      const configPath = path.join(localConfigDir, 'server-config.json');
      const config = await fs.readFile(configPath, 'utf-8');
      const json = JSON.parse(config);

      const docs = json.docs.filter(d =>
        d.environments.includes(process.env.DEPLOY_ENV)
      );

      const productFamilies = json.productFamilies;
      const localConfig = { docs: docs, productFamilies: productFamilies };
      return localConfig;
    } else {
      const result = await fetch(
        `${process.env.DOC_S3_URL}/portal-config/config.json`
      );
      const json = await result.json();
      return json;
    }
  } catch (err) {
    console.log(err);
    return { docs: [] };
  }
}

async function isPublicDoc(url) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = await getConfig();
  const matchingDoc = config.docs.find(d =>
    relativeUrl.startsWith(d.url + '/')
  );

  if (matchingDoc && matchingDoc.public) {
    return true;
  }

  return false;
}

async function getRootBreadcrumb(pagePathname) {
  try {
    const breadcrumbsFile = await fs.readFile(breadcrumbsConfigPath, 'utf-8');
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

module.exports = {
  getConfig,
  isPublicDoc,
  getRootBreadcrumb,
};
