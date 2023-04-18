const fetch = require('node-fetch-retry');
const fs = require('fs');
const path = require('path');
const { winstonLogger } = require('./loggerController');

let storedConfig;

async function loadConfig() {
  try {
    let config;
    if (process.env.LOCAL_CONFIG === 'yes') {
      const deployEnv =
        process.env.DEPLOY_ENV === 'omega2-andromeda'
          ? 'prod'
          : process.env.DEPLOY_ENV;
      console.log(`Getting local config for the "${deployEnv}" environment`);

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
              const docs = json.docs.filter((d) =>
                d.environments.includes(deployEnv)
              );
              localConfig['docs'].push(...docs);
            }
          }
          return localConfig;
        } catch (funcErr) {
          throw new Error(
            `Cannot read local config file from path: ${dirPath}: ${funcErr}`
          );
        }
      }

      const localConfigDir = path.resolve(
        `${__dirname}/../../.teamcity/config/docs`
      );
      config = readFilesInDir(localConfigDir);
    } else {
      try {
        winstonLogger.info('WOW!, FETCHING CONFIG, WOW!');
        const result = await fetch(
          `${process.env.DOC_S3_URL}/portal-config/config.json`,
          {
            retry: 5,
            pause: 1000,
            callback: (retry) => {
              console.log(`Retrying fetch of config.json: ${retry}`);
            },
          }
        );
        if (result.ok == false) {
          throw new Error(
            `Response status: ${result.status}
                    Response type: ${result.type}
                    Response URL: ${result.url}
                    Response redirected: ${result.redirected}`
          );
        }
        config = await result.json();
      } catch (s3err) {
        throw new Error(
          `Problem reading config from S3 ${process.env.DOC_S3_URL}: ${s3err}`
        );
      }
    }
    return config;
  } catch (err) {
    winstonLogger.error(
      `Error getting config!
        ERROR: ${err}`
    );
    return { docs: [] };
  }
}

async function expensiveLoadConfig() {
  try {
    storedConfig = await loadConfig();
    return storedConfig !== undefined;
  } catch (err) {
    winstonLogger.error(
      `Problem during expensive load config 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

expensiveLoadConfig();

async function getConfig(reqObj, resObj) {
  try {
    if (!storedConfig || !storedConfig.docs || storedConfig.docs.length === 0) {
      await expensiveLoadConfig();
    }
    const config = JSON.parse(JSON.stringify(storedConfig));
    const hasGuidewireEmail = resObj.locals.userInfo.hasGuidewireEmail;
    if (!reqObj.session.requestIsAuthenticated) {
      config['docs'] = config.docs.filter((d) => d.public === true);
    }
    if (!hasGuidewireEmail) {
      config['docs'] = config.docs.filter((d) => d.internal === false);
    }
    return config;
  } catch (err) {
    winstonLogger.error(
      `There was a problem with the getConfig() function
        ERROR: ${JSON.stringify(err)}`
    );
    return { docs: [] };
  }
}

async function getDocByUrl(url) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = storedConfig;
  return config.docs.find((d) => relativeUrl.startsWith(d.url + '/'));
}

async function isPublicDoc(url, reqObj) {
  try {
    const matchingDoc = await getDocByUrl(url, reqObj);
    return !!(matchingDoc && matchingDoc.public);
  } catch (err) {
    winstonLogger.error(
      `Problem getting doc by url
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function isInternalDoc(url, reqObj) {
  try {
    const matchingDoc = await getDocByUrl(url, reqObj);
    return !!(matchingDoc && matchingDoc.internal);
  } catch (err) {
    winstonLogger.error(
      `Problem determining if doc is internal
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function getRootBreadcrumb(pagePathname) {
  try {
    const breadcrumbsConfigPath = new URL(
      `pages/breadcrumbs.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(breadcrumbsConfigPath);
    if (response.ok) {
      const breadcrumbsMapping = await response.json();
      try {
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
    }
    return { rootPage: {} };
  } catch (err) {
    winstonLogger.error(
      `Something wrong when trying to get the root breadcrumb
          ERROR: ${JSON.stringify(err)}`
    );
    return { rootPage: {} };
  }
}

async function getVersionSelector(docId, reqObj, resObj) {
  try {
    const versionSelectorsConfigPath = new URL(
      `pages/versionSelectors.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(versionSelectorsConfigPath);
    if (response.ok) {
      const versionSelectorMapping = await response.json();
      try {
        const matchingVersionSelector = versionSelectorMapping.find(
          (s) => docId === s.docId
        );
        // The getConfig function checks if the request is authenticated and if the user has the Guidewire email,
        // and filters the returned docs accordingly.
        // Therefore, for the selector it's enough to check if a particular version has a doc in the returned config.
        const config = await getConfig(reqObj, resObj);
        const docs = config.docs;
        if (matchingVersionSelector) {
          matchingVersionSelector['allVersions'] =
            matchingVersionSelector.allVersions.filter((v) =>
              docs.find((d) => d.url === v.url)
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
    } else {
      return { matchingVersionSelector: {} };
    }
  } catch (err) {
    winstonLogger.error(
      `Holy Moly! Cannot get version selector!
          ERROR: ${JSON.stringify(err)}`
    );
    return { matchingVersionSelector: {} };
  }
}

async function getDocumentMetadata(docId, reqObj, resObj) {
  try {
    const config = await getConfig(reqObj, resObj);
    const doc = config.docs.find((d) => d.id === docId);
    if (doc) {
      return {
        docTitle: doc.title,
        docUrl: doc.url,
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
  } catch (err) {
    winstonLogger.error(
      `Problem getting document metadata
              docId: ${docId}, 
              ERROR: ${JSON.stringify(err)}`
    );
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
  try {
    const config = await getConfig(reqObj, resObj);
    const doc = config.docs.find(
      (s) =>
        products.split(',').some((p) => s.metadata.product.includes(p)) &&
        platforms.split(',').some((pl) => s.metadata.platform.includes(pl)) &&
        versions.split(',').some((v) => s.metadata.version.includes(v)) &&
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
  } catch (err) {
    winstonLogger.error(
      `Problem getting document id
              url: ${url}, 
              title: ${title},
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

/* Finds a doc URL based on product, version, and title.
 ** WARNING: This function is a bit fuzzy. It will find a match
 ** if the doc title that is passed to it matches either exactly
 ** or has ' Guide' appended to it. Many docs are in the config
 ** as, for example, "Installation", but to avoid awkward human-speech
 ** in prose, are defined in library keys as "Installation Guide", so
 ** we allow that one exception. */
async function getDocUrlByMetadata(products, versions, title, reqObj, resObj) {
  try {
    const config = await getConfig(reqObj, resObj);
    const doc = config.docs.find(
      (s) =>
        products.split(',').some((p) => s.metadata.product.includes(p)) &&
        versions.split(',').some((v) => s.metadata.version.includes(v)) &&
        (title === s.title || title === `${s.title} Guide`)
    );
    if (doc) {
      return {
        url: doc.url,
      };
    } else {
      return {
        error: true,
        message: `Did not find a doc matching the provided info: ${products}, ${versions}, ${title}`,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting document url by metadata
              title: ${title},
              product: ${products},
              versions: ${versions}
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

async function getUrlsByWildcard(url) {
  try {
    if (!storedConfig || !storedConfig.docs || storedConfig.docs.length === 0) {
      await expensiveLoadConfig();
    }
    const config = JSON.parse(JSON.stringify(storedConfig));

    const testUrlSegments = url.replace(/^\/+/, '').split('/');
    let wildcardIndex;
    for (let i = 0; i < testUrlSegments.length; i++) {
      if (testUrlSegments[i] === '*') {
        wildcardIndex = i;
        break;
      }
    }

    let matches = config.docs
      .filter((doc) => {
        let docUrl = doc.url;
        const docUrlSegments = doc.url.split('/').map((segment, index) => {
          if (wildcardIndex === index) {
            return '[^/]*';
          }
          return segment;
        });
        docUrl = docUrlSegments.join('/');
        const regex = new RegExp('^' + docUrl);
        return regex.test(url);
      })
      .map((doc) => doc.url);

    while (matches.length > 0 && testUrlSegments[wildcardIndex + 1]) {
      const nextMatches = matches.filter((match) => {
        const matchSegments = match.split('/');
        if (matchSegments[wildcardIndex + 1]) {
          return (
            matchSegments[wildcardIndex + 1] ===
            testUrlSegments[wildcardIndex + 1]
          );
        }
      });
      if (nextMatches.length === 0) break;
      matches = nextMatches;
      wildcardIndex++;
    }

    const latestMatch = matches.find((match) => match.includes('/latest'));
    if (latestMatch) {
      return [latestMatch];
    }

    if (matches.length > 0) {
      return matches;
    } else {
      return {
        error: true,
        message: `Did not find any docs matching ${url}.`,
      };
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting document urls by wildcard match
              url: ${url}
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

module.exports = {
  getConfig,
  expensiveLoadConfig,
  isPublicDoc,
  isInternalDoc,
  getRootBreadcrumb,
  getVersionSelector,
  getDocumentMetadata,
  getDocId,
  getDocUrlByMetadata,
  getUrlsByWildcard,
};
