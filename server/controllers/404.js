const fetch = require('node-fetch-retry');
const { getUrlsByWildcard } = require('./configController');
const redirectUrls = [
  {
    from: 'cloud/cda/banff',
    to: 'cloudProducts/cloudDataAccess/latest',
  },
  {
    from: 'cloud/cda/aspen',
    to: 'cloudProducts/cloudDataAccess/latest',
  },
  {
    from: 'cloud/restapi/latest/release-notes',
    to: 'cloud/gw-feature-preview/igrelnotes',
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
    from: 'cloud/gw-feature-preview/latest',
    to: 'cloudProducts/cortina/featurePreview',
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
    from: 'cloudProducts/Aspen/billingCenterCloud/explore/latest',
    to: 'cloudProducts/explore/latest',
  },
  {
    from: 'cloudProducts/Aspen/claimCenterCloud/explore/latest',
    to: 'cloudProducts/explore/latest',
  },
  {
    from: 'cloudProducts/Aspen/policyCenterCloud/explore/latest',
    to: 'cloudProducts/explore/latest',
  },
  {
    from: 'cloudProducts/Aspen/insuranceNow/IN20201xExt/latest',
    to: 'cloudProducts/aspen/insuranceNow/2020.1xExternalAudience',
  },
  {
    from: 'cloudProducts/Aspen/insuranceNow/IN20201xInt/latest',
    to: 'cloudProducts/aspen/insuranceNow/2020.1xInternalAudience',
  },
  {
    from: 'cloudProducts/Aspen/insuranceNow/insNowAspen/2020.1',
    to: 'cloudProducts/aspen/insuranceNow/2020.1',
  },
  {
    from: 'cloudProducts/Aspen/guidewireCloudPlatform/gwCloudConsole/latest',
    to: 'cloudProducts/aspen/guidewireCloudPlatform',
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
    to: 'cloudProducts/banff/guidewireCloudPlatform',
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
    from: 'cloud/bc/202011/cloud/active/config/topics/p-basics.html',
    to: 'cloud/bc/202104/config',
  },
  {
    from: 'cloud/cc/202011/cloud/active/config/topics/p-basics.html',
    to: 'cloud/cc/202104/config',
  },
  {
    from: 'cloud/pc/202011/cloud/active/config/topics/p-basics.html',
    to: 'cloud/pc/202104/config',
  },
  {
    from: 'cloud/bc/config/latest',
    to: 'cloud/bc/202104/config',
  },
  {
    from: 'cloud/cc/config/latest',
    to: 'cloud/cc/202104/config',
  },
  {
    from: 'cloud/pc/config/latest',
    to: 'cloud/pc/202104/config',
  },
  {
    from: 'cloud/pc/202011/cloud/active/adv-product-designer/topics/c_intro.html',
    to: 'cloud/pc/202104/apd',
  },
  {
    from: 'cloud/pc/apd/latest',
    to: 'cloud/pc/202104/apd',
  },
  {
    from: 'cloud/in/20202/2020.2.x/active/ConfigurationGuide/c_Overview.html',
    to: 'cloud/in/20211/config',
  },
  {
    from: 'cloud/in/config/latest',
    to: 'cloud/in/20211/config',
  },
  {
    from: 'cloud/bc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'cloud/is/202104/gosu',
  },
  {
    from: 'cloud/cc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'cloud/is/202104/gosu',
  },
  {
    from: 'cloud/pc/202011/cloud/active/gosu/topics/c_p-basics.html',
    to: 'cloud/is/202104/gosu',
  },
  {
    from: 'cloud/is/gosu/latest',
    to: 'cloud/is/202104/gosu',
  },
  {
    from: 'cloud/bc/integration/latest',
    to: 'cloud/bc/202104/integration',
  },
  {
    from: 'cloud/cc/integration/latest',
    to: 'cloud/cc/202104/integration',
  },
  {
    from: 'cloud/pc/integration/latest',
    to: 'cloud/pc/202104/integration',
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
    to: 'cloud/in/20211/portaldev',
  },
  {
    from: 'cloud/in/portaldev/latest',
    to: 'cloud/in/20211/portaldev',
  },
  {
    from: 'cloud/is/202011/restapiclient/REST-API-Client/topics/c_overview-rest-client.html',
    to: 'is/restapiclient/guide',
  },
  {
    from: 'jutro/documentation/latest',
    to: 'jutro/documentation/5.4.0',
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
];

async function getRedirectUrl(originUrl) {
  const originPathname = new URL(originUrl).pathname;
  const originBase = new URL(originUrl).origin;

  for (const urlObj of redirectUrls) {
    if (`/${urlObj.from}` === originPathname) {
      return `/${urlObj.to}`;
    }
  }
  if (originPathname.includes('/latest')) {
    const latestVersionUrl = await getLatestVersionUrl(
      originPathname,
      originBase
    );
    if (latestVersionUrl) {
      return `/${latestVersionUrl}`;
    }
  }
  return undefined;
}

async function getLatestVersionUrl(url, urlBase) {
  const wildcardUrl = url
    .replace('latest', '*')
    .replace(/^\/+/, '')
    .replace(/\/$/, '');
  const wildcardIndex = wildcardUrl.split('/').indexOf('*');
  const urlAfterWildcardSegments = wildcardUrl
    .split('/')
    .map((segment, index) => {
      if (index > wildcardIndex) {
        return segment;
      }
      return;
    });
  const urlAfterWildcard = urlAfterWildcardSegments
    .join('/')
    .replace(/^\/+/, '');

  const matchingUrls = await getUrlsByWildcard(wildcardUrl);
  if (matchingUrls) {
    let highestNumber = -Infinity;
    let highestNumberUrl = null;
    let highestAlphabeticalUrl = null;
    Object.values(matchingUrls).forEach((url) => {
      const urlSegments = url.split('/');
      const urlVersionSegment = urlSegments[wildcardIndex];
      if (!isNaN(urlVersionSegment)) {
        const urlNumber = parseInt(urlVersionSegment);
        if (urlNumber > highestNumber) {
          highestNumber = urlNumber;
          highestNumberUrl = url;
        }
      } else if (
        urlSegments[wildcardIndex] &&
        (!highestAlphabeticalUrl ||
          urlVersionSegment.localeCompare(highestAlphabeticalUrl) > 0)
      ) {
        highestAlphabeticalUrl = urlSegments[wildcardIndex];
        highestNumberUrl = url;
      }
    });
    if (!highestNumberUrl) return;

    const highestNumberUrlSegments = highestNumberUrl
      .split('/')
      .map((segment, index) => {
        if (index <= wildcardIndex) {
          return segment;
        }
        return;
      });

    let highestNumberUrlWithSuffix = highestNumberUrlSegments.join('/');
    if (
      highestNumberUrlWithSuffix.endsWith('/') &&
      urlAfterWildcard.startsWith('/')
    ) {
      highestNumberUrlWithSuffix = highestNumberUrlWithSuffix
        .slice(0, -1)
        .concat(urlAfterWildcard);
    } else if (
      highestNumberUrlWithSuffix.endsWith('/') ||
      urlAfterWildcard.startsWith('/')
    ) {
      highestNumberUrlWithSuffix =
        highestNumberUrlWithSuffix.concat(urlAfterWildcard);
    } else {
      highestNumberUrlWithSuffix = highestNumberUrlWithSuffix.concat(
        '/',
        urlAfterWildcard
      );
    }

    if (await isHtmlPage(`${urlBase}/${highestNumberUrlWithSuffix}`)) {
      return highestNumberUrlWithSuffix;
    } else {
      return highestNumberUrl;
    }
  }
  return;
}

async function isHtmlPage(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (
      response.ok &&
      response.headers.get('content-type').includes('text/html')
    ) {
      return true;
    } else return false;
  } catch (err) {
    console.error(`Error checking if HTML page exists at ${url}: ${err}`);
    return false;
  }
}
module.exports = { getRedirectUrl };
