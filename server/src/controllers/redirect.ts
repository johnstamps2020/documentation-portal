import { getDocByUrl } from './configController';
import { ApiResponse } from '../types/apiResponse';
import { winstonLogger } from './loggerController';
import { Doc } from '../model/entity/Doc';
import { AppDataSource } from '../model/connection';
import { isUserAllowedToAccessResource } from './authController';
import { Response } from 'express';

const fetch = require('node-fetch-retry');
const redirectUrls = [
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
    to: 'cloudProducts/explore/latest',
  },
  {
    from: 'cloudProducts/Banff/claimCenterCloud/explore/latest',
    to: 'cloudProducts/explore/latest',
  },
  {
    from: 'cloudProducts/Banff/policyCenterCloud/explore/latest',
    to: 'cloudProducts/explore/latest',
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

export async function isHtmlPage(url: string) {
  try {
    const fullUrl = process.env.DOC_S3_URL + url;
    const response = await fetch(fullUrl, { method: 'HEAD' });
    return (
      response.status === 200 &&
      response.headers.get('content-type')?.includes('text/html')
    );
  } catch (err) {
    winstonLogger.error(`Error checking if HTML page exists at ${url}: ${err}`);
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

function getPathname(url: string): string {
  return new URL(url).pathname.replace(/^\//, '').replace(/\/$/, '');
}

function sortUrlsByVersion(a: string[], b: string[], wildcardIndex: number) {
  const isANumber = !isNaN(parseInt(a[wildcardIndex], 10));
  const isBNumber = !isNaN(parseInt(b[wildcardIndex], 10));

  if (isANumber && isBNumber) {
    // Both elements are numbers, so sort numerically
    return parseInt(a[wildcardIndex], 10) - parseInt(b[wildcardIndex], 10);
  } else if (isANumber) {
    // Only element at wildcardIndex in 'a' is a number, so 'a' comes first
    return -1;
  } else if (isBNumber) {
    // Only element at wildcardIndex in 'b' is a number, so 'b' comes first
    return 1;
  } else {
    // Both elements are not numbers, so sort alphabetically
    return a[wildcardIndex].localeCompare(b[wildcardIndex]);
  }
}

export async function getLatestVersionUrl(
  res: Response,
  pathname: string
): Promise<string | null> {
  const wildcardUrlSegments = pathname.replace('latest', '%').split('/');
  const urlsToCheck = [];
  for (const segment of wildcardUrlSegments) {
    const partialUrl = wildcardUrlSegments
      .slice(
        0,
        wildcardUrlSegments.length - wildcardUrlSegments.indexOf(segment)
      )
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
  const targetUrlExists = await isHtmlPage(`/${targetUrl}`);
  return targetUrlExists ? targetUrl : urlWithHighestVersionSegments.join('/');
}

// FIXME: In master, this function was used in the 404 route. This route was removed and now we have a 404 page in React.
//  Maybe we should create a middleware to handle resolution of links with latest?
export async function getRedirectUrl(
  res: Response,
  originUrl: string | null | undefined
): Promise<ApiResponse> {
  try {
    if (!originUrl) {
      return {
        status: 404,
        body: {
          message: 'Redirect URL not found because the origin URL is empty.',
        },
      };
    }
    const originPathname = getPathname(originUrl);
    for (const urlObj of redirectUrls) {
      if (urlObj.from === originPathname) {
        return {
          status: 308,
          body: `/${urlObj.to}`,
        };
      }
    }
    if (originUrl.includes('/latest')) {
      const latestVersionUrl = await getLatestVersionUrl(res, originPathname);
      if (latestVersionUrl) {
        return {
          status: 307,
          body: `/${latestVersionUrl}`,
        };
      }
    }
    const matchingDoc = await getDocByUrl(originPathname);
    if (!matchingDoc) {
      return {
        status: 404,
        body: {
          message: 'Redirect URL does not exist',
        },
      };
    }
    const isUserAllowedToAccessResourceResult = isUserAllowedToAccessResource(
      res,
      matchingDoc.public,
      matchingDoc.internal,
      matchingDoc.isInProduction
    );
    if (isUserAllowedToAccessResourceResult.status === 200) {
      return {
        status: 307,
        body: `/${matchingDoc.url}`,
      };
    }
    return {
      status: 404,
      body: {
        message: 'Redirect URL does not exist',
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        message: `Redirect URL not found due to an error. Error: ${err}`,
      },
    };
  }
}
