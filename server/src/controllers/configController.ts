import fetch from 'node-fetch';
import { readdirSync, lstatSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { winstonLogger } from './loggerController';
import { ServerConfig } from '../types/config';
import { Request, Response } from 'express';
import { Environment } from '../types/environment';
import { VersionSelector } from '../model/entity/VersionSelector';
import { AppDataSource } from '../model/connection';
import { DocConfig } from '../model/entity/DocConfig';

let storedConfig: ServerConfig;

function readFilesInDir(dirPath: string, deployEnv: Environment): ServerConfig {
  try {
    const localConfig: ServerConfig = { docs: [] };
    const itemsInDir = readdirSync(dirPath);
    for (const item of itemsInDir) {
      const itemPath = join(dirPath, item);
      if (lstatSync(itemPath).isDirectory()) {
        localConfig['docs'].push(...readFilesInDir(itemPath, deployEnv).docs);
      } else {
        const config = readFileSync(itemPath, 'utf-8');
        const json: ServerConfig = JSON.parse(config);
        const docs = json.docs.filter(d => d.environments.includes(deployEnv));
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

async function loadConfig() {
  try {
    let config;
    if (process.env.LOCAL_CONFIG === 'yes') {
      const deployEnv =
        process.env.DEPLOY_ENV === 'us-east-2'
          ? 'prod'
          : process.env.DEPLOY_ENV;
      console.log(`Getting local config for the "${deployEnv}" environment`);

      const selectedEnv = deployEnv as Environment;

      const localConfigDir = resolve(
        `${__dirname}/../../.teamcity/config/docs`
      );
      config = readFilesInDir(localConfigDir, selectedEnv);
    } else {
      try {
        winstonLogger.info('WOW!, FETCHING CONFIG, WOW!');
        const result = await fetch(
          `${process.env.DOC_S3_URL}/portal-config/config.json`
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
        ERROR: ${JSON.stringify(err)}`
    );
    return { docs: [] };
  }
}

export async function expensiveLoadConfig() {
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

export async function getConfig(reqObj: Request, resObj: Response) {
  try {
    if (!storedConfig || !storedConfig.docs || storedConfig.docs.length === 0) {
      await expensiveLoadConfig();
    }
    const config: ServerConfig = JSON.parse(JSON.stringify(storedConfig));
    const hasGuidewireEmail = resObj.locals.userInfo.hasGuidewireEmail;
    if (!reqObj.session || !reqObj.session.requestIsAuthenticated) {
      config['docs'] = config.docs.filter(d => d.public === true);
    }
    if (!hasGuidewireEmail) {
      config['docs'] = config.docs.filter(d => d.internal === false);
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

async function getDocByUrl(url: string) {
  let relativeUrl = url + '/';
  if (relativeUrl.startsWith('/')) {
    relativeUrl = relativeUrl.substring(1);
  }

  const config = storedConfig;
  return config.docs.find(d => relativeUrl.startsWith(d.url + '/'));
}

export async function isPublicDoc(url: string) {
  try {
    const matchingDoc = await getDocByUrl(url);
    return !!(matchingDoc && matchingDoc.public);
  } catch (err) {
    winstonLogger.error(
      `Problem getting doc by url
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function isInternalDoc(url: string) {
  try {
    const matchingDoc = await getDocByUrl(url);
    return !!(matchingDoc && matchingDoc.internal);
  } catch (err) {
    winstonLogger.error(
      `Problem determining if doc is internal
              url: ${url}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function getRootBreadcrumb(pagePathname: string) {
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

export async function getVersionSelector(
  docId: string,
  reqObj: Request,
  resObj: Response
) {
  try {
    const versionSelectorsConfigPath = new URL(
      `pages/versionSelectors.json`,
      process.env.DOC_S3_URL
    ).href;
    const response = await fetch(versionSelectorsConfigPath);
    if (response.ok) {
      const versionSelectorMapping: VersionSelector[] = await response.json();
      try {
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

export async function getDocumentMetadata(
  docId: string,
  reqObj: Request,
  resObj: Response
) {
  try {
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
  } catch (err) {
    winstonLogger.error(
      `Problem getting document metadata
              docId: ${docId}, 
              ERROR: ${JSON.stringify(err)}`
    );
  }
}

export async function getDocId(
  products: string,
  platforms: string,
  versions: string,
  title: string,
  url: string
) {
  try {
    const doc = await AppDataSource.manager.findOneBy(DocConfig, {
      url: url,
    });

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

export function getEnv() {
  return { envName: process.env.DEPLOY_ENV };
}
