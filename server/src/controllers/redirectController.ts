import { Request, Response } from 'express';
import { AppDataSource } from '../model/connection';
import { Doc } from '../model/entity/Doc';
import { RedirectResponse } from '../types/apiResponse';
import { getEnvInfo } from './envController';
import { winstonLogger } from './loggerController';
import { isUserAllowedToAccessResource } from './authController';

const fetch = require('node-fetch-retry');

const isProd = getEnvInfo()?.name === 'omega2-andromeda';
const permanentRedirectUrls = [
  {
    from: 'cloud/cda/banff',
    to: 'cloudProducts/dataPlatform',
  },
  {
    from: 'cloud/cda/aspen',
    to: 'cloudProducts/dataPlatform',
  },
  {
    from: 'cloudProducts/Aspen',
    to: 'cloudProducts/aspen',
  },
  {
    from: 'cloudProducts/Banff',
    to: 'cloudProducts/banff',
  },
  {
    from: 'cloudProducts/Cortina',
    to: 'cloudProducts/cortina',
  },
  {
    from: 'jutro/documentation/4.1.1',
    to: 'jutroDesignSystem/4.1.1',
  },
  {
    from: 'selfManagedProducts/jutroDesignSystem/4.1.1',
    to: 'jutroDesignSystem/4.1.1',
  },
  {
    from: 'cloudProducts/Banff/billingCenterCloud/explore/latest',
    to: 'cloud/explore/app',
  },
  {
    from: 'cloudProducts/Banff/claimCenterCloud/explore/latest',
    to: 'cloud/explore/app',
  },
  {
    from: 'cloudProducts/Banff/policyCenterCloud/explore/latest',
    to: 'cloud/explore/app',
  },
  {
    from: 'cloudProducts/Banff/insuranceNow/IN20202xExt/latest',
    to: 'cloudProducts/banff/insuranceNow/2020.2xExternalAudience',
  },
  {
    from: 'cloudProducts/Banff/insuranceNow/IN20202xInt/latest',
    to: 'cloudProducts/banff/insuranceNow/2020.2xInternalAudience',
  },
  {
    from: 'cloudProducts/Banff/insuranceNow/insuranceNow/2020.2',
    to: 'cloudProducts/banff/insuranceNow/2020.2',
  },
  {
    from: 'cloudProducts/Banff/billingCenterCloud/jutroDesignSystem/4.1.1',
    to: 'jutroDesignSystem/4.1.1',
  },
  {
    from: 'cloudProducts/Banff/claimCenterCloud/jutroDesignSystem/4.1.1',
    to: 'jutroDesignSystem/4.1.1',
  },
  {
    from: 'cloudProducts/Banff/policyCenterCloud/jutroDesignSystem/4.1.1',
    to: 'jutroDesignSystem/4.1.1',
  },
  {
    from: 'cloudProducts/Banff/guidewireCloudPlatform/gwCloudConsole/latest',
    to: 'cloudProducts/guidewireCloudPlatform',
  },
  {
    from: 'cloudProducts/Cortina/billingCenterCloud/jutroDesignSystem/5.3.0',
    to: 'jutroDesignSystem/5.3.0',
  },
  {
    from: 'cloudProducts/Cortina/claimCenterCloud/jutroDesignSystem/5.3.0',
    to: 'jutroDesignSystem/5.3.0',
  },
  {
    from: 'cloudProducts/Cortina/policyCenterCloud/jutroDesignSystem/5.3.0',
    to: 'jutroDesignSystem/5.3.0',
  },
  {
    from: 'cloudProducts/Cortina/billingCenterCloud/dhGwCloud/2021.04',
    to: 'cloudProducts/cortina/dhGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Cortina/claimCenterCloud/dhGwCloud/2021.04',
    to: 'cloudProducts/cortina/dhGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Cortina/policyCenterCloud/dhGwCloud/2021.04',
    to: 'cloudProducts/cortina/dhGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Cortina/billingCenterCloud/icGwCloud/2021.04',
    to: 'cloudProducts/cortina/icGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Cortina/claimCenterCloud/icGwCloud/2021.04',
    to: 'cloudProducts/cortina/icGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Cortina/policyCenterCloud/icGwCloud/2021.04',
    to: 'cloudProducts/cortina/icGwCloud/2021.04',
  },
  {
    from: 'cloudProducts/Aspen/insuranceNow',
    to: 'cloudProducts/aspen/insuranceNow/2020.1',
  },
  {
    from: 'cloudProducts/Banff/insuranceNow',
    to: 'cloudProducts/banff/insuranceNow/2020.2',
  },
  {
    from: 'cloudProducts/Cortina/insuranceNow/insuranceNow/2021.1',
    to: 'cloudProducts/cortina/insuranceNow/2021.1',
  },
  {
    from: 'cloud/bc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'is/gosu',
  },
  {
    from: 'cloud/cc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'is/gosu',
  },
  {
    from: 'cloud/pc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'is/gosu',
  },
  {
    from: 'cloud/is/gosu/latest',
    to: 'is/gosu',
  },
  {
    from: 'cloud/in/20202/config/2020.2.x/active/ConfigurationGuide/CloudCommonPaymentService/c_CloudCommonPaymentServiceconfiguration.html',
    to: 'cloud/in/20211/config/2021.1.x/ConfigurationGuide/c_payment-config.html',
  },
  {
    from: 'cloud/in/payment-config/latest',
    to: 'cloud/in/20211/config/2021.1.x/ConfigurationGuide/c_payment-config.html',
  },
  {
    from: 'cloud/in/20202/2020.2.x/active/PortalDevelopment/topics/c_overview_portal_development.html',
    to: 'cloud/in/latest/portaldev',
  },
  {
    from: 'cloud/in/portaldev/latest',
    to: 'cloud/in/latest/portaldev',
  },
  {
    from: 'cloud/is/202011/restapiclient/REST-API-Client/topics/c_overview-rest-client.html',
    to: 'is/restapiclient/guide',
  },
  {
    from: 'portal/secure/upgradediff',
    to: 'upgradediffs',
  },
  {
    from: 'portal/secure/upgradediff/index.html',
    to: 'upgradediffs',
  },
  {
    from: 'cloud/testingframeworks/202111/api/gw-api/topics/c_overview.html%20',
    to: 'cloud/testingframeworks/202111/api/gw-api/topics/c_overview.html',
  },
  {
    from: 'cloudProducts/cloudDataAccess/latest',
    to: 'cloud/cda/guide/latest',
  },
  {
    from: 'cloudProducts/cloudConsole',
    to: 'cloud/gcc-guide/insurer-developer/latest',
  },
];
const temporaryRedirectUrls = [
  {
    from: '',
    to: isProd ? 'cloudProducts/innsbruck' : 'cloudProducts/innsbruck',
  },
  {
    from: 'cloudProducts',
    to: isProd ? 'cloudProducts/innsbruck' : 'cloudProducts/innsbruck',
  },
  {
    from: 'apiReferences',
    to: isProd ? 'apiReferences/innsbruck' : 'apiReferences/innsbruck',
  },
];

export function isHtmlRequest(url: string) {
  return /(^(?!.*\.\D+$).*$|\.htm.*$)/.test(url);
}

export function addPrecedingSlashToPath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

export async function s3BucketUrlExists(url: string): Promise<boolean> {
  const urlToCheck = addPrecedingSlashToPath(url);
  try {
    const s3BucketUrl = urlToCheck.startsWith('/portal')
      ? process.env.PORTAL2_S3_URL
      : process.env.DOC_S3_URL;
    const fullUrl = s3BucketUrl + urlToCheck;
    const response = await fetch(fullUrl, { method: 'HEAD' });

    return response.ok || response.redirected;
  } catch (err) {
    winstonLogger.error(
      `Error checking if S3 bucket URL exists at ${urlToCheck}: ${err}`
    );
    return false;
  }
}

async function findMatchingDocs(res: Response, urls: string[]) {
  for (const u of urls) {
    const matches: Doc[] = await AppDataSource.getRepository(Doc)
      .createQueryBuilder('doc')
      .useIndex('docUrl-idx')
      .select([
        'doc.url',
        'doc.id',
        'doc.public',
        'doc.internal',
        'doc.isInProduction',
      ])
      .where(
        "doc.url LIKE :urlPattern AND doc.url NOT LIKE :excludedUrlPattern AND doc.url NOT LIKE '%next%'",
        { urlPattern: u, excludedUrlPattern: u.replace('%', '%/%') }
      )
      .getMany();
    if (matches.length > 0) {
      return matches.filter(
        (m) =>
          isUserAllowedToAccessResource(
            res,
            m.public,
            m.internal,
            m.isInProduction
          ).status === 200
      );
    }
  }
  return [];
}

function removeSlashesFromPath(path: string): string {
  return path.replace(/^\//, '').replace(/\/$/, '');
}

export function sortUrlsByVersion(
  a: string[],
  b: string[],
  wildcardIndex: number
): number {
  return a[wildcardIndex].localeCompare(b[wildcardIndex], undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export async function getLatestVersionUrl(
  res: Response,
  pathname: string
): Promise<string | null> {
  const wildcardUrlSegments = pathname.replace('latest', '%').split('/');
  const urlsToCheck: string[] = [];
  for (const segmentIndex in wildcardUrlSegments) {
    const partialUrl = wildcardUrlSegments
      .slice(0, wildcardUrlSegments.length - parseInt(segmentIndex))
      .join('/');
    if (partialUrl.includes('%')) {
      urlsToCheck.push(partialUrl);
    }
  }

  const matchingDocs = await findMatchingDocs(res, urlsToCheck);
  if (matchingDocs.length === 0) {
    return null;
  }
  const wildcardIndex = wildcardUrlSegments.indexOf('%');
  const sortedUrls = matchingDocs
    .map((d) => d.url.split('/'))
    .sort((a, b) => sortUrlsByVersion(a, b, wildcardIndex))
    .reverse();
  const urlWithHighestVersionSegments = sortedUrls[0];
  const targetUrlSegments = Array.from(wildcardUrlSegments);
  targetUrlSegments[wildcardIndex] =
    urlWithHighestVersionSegments[wildcardIndex];
  const targetUrl = targetUrlSegments.join('/');
  const targetUrlExists = await s3BucketUrlExists(targetUrl);
  return targetUrlExists ? targetUrl : urlWithHighestVersionSegments.join('/');
}

export async function getRedirectUrl(
  req: Request,
  res: Response,
  requestedPath: string | null | undefined
): Promise<RedirectResponse> {
  try {
    if (requestedPath === null || requestedPath === undefined) {
      return {
        status: 200,
        body: {
          redirectStatusCode: 404,
          redirectUrl: null,
          message: 'The cameFrom parameter was not provided',
        },
      };
    }
    if (!isHtmlRequest(requestedPath)) {
      return {
        status: 200,
        body: {
          redirectStatusCode: 404,
          redirectUrl: null,
          message: 'Redirect URL is not supported for non-HTML requests',
        },
      };
    }
    const normalizedPath = removeSlashesFromPath(requestedPath);
    for (const urlObj of permanentRedirectUrls) {
      if (urlObj.from === normalizedPath) {
        return {
          status: 200,
          body: {
            redirectStatusCode: 308,
            redirectUrl: `/${urlObj.to}`,
          },
        };
      }
    }
    for (const urlObj of temporaryRedirectUrls) {
      if (urlObj.from === normalizedPath) {
        return {
          status: 200,
          body: {
            redirectStatusCode: 307,
            redirectUrl: `/${urlObj.to}`,
          },
        };
      }
    }
    if (requestedPath.includes('/latest')) {
      const pathExists = await s3BucketUrlExists(requestedPath);
      if (!pathExists) {
        const latestVersionUrl = await getLatestVersionUrl(res, normalizedPath);
        if (!latestVersionUrl && !req.isAuthenticated()) {
          return {
            status: 403,
            body: {
              redirectStatusCode: 307,
              redirectUrl: `/gw-login?redirectTo=${requestedPath}`,
            },
          };
        }
        if (latestVersionUrl) {
          return {
            status: 200,
            body: {
              redirectStatusCode: 307,
              redirectUrl: `/${latestVersionUrl}`,
            },
          };
        }
      }
    }
    return {
      status: 200,
      body: {
        redirectStatusCode: 404,
        redirectUrl: null,
        message: `Redirect URL not found for path: ${normalizedPath}`,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        redirectStatusCode: 404,
        redirectUrl: null,
        message: `Redirect URL not found due to an error: ${err}`,
      },
    };
  }
}
