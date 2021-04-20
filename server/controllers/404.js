const redirectUrls = [
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
    from: 'cloudProducts/Cortina/insuranceNow/insuranceNow/2021.1',
    to: 'cloudProducts/cortina/insuranceNow/2021.1',
  },
];

function getRedirectUrl(originUrl) {
  const originPathname = new URL(originUrl).pathname;
  for (const urlObj of redirectUrls) {
    if (`/${urlObj.from}` === originPathname) {
      return `/${urlObj.to}`;
    }
  }
  return undefined;
}

module.exports = { getRedirectUrl };
