import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import pluginInfo from '../../../plugins/gw-plugin-redoc/package.json';
import themeInfo from '../../../themes/gw-theme-classic/package.json';
import securityInfo from '../../../plugins/docusaurus-security/package.json';

type InstallationCodeBlockProps = {
  packageName: string;
};

const versions = {
  'gw-theme-classic': themeInfo.version,
  'gw-plugin-redoc': pluginInfo.version,
  'docusaurus-security': securityInfo.version,
};

export default function InstallationCodeBlock({
  packageName,
}: InstallationCodeBlockProps) {
  const installationString = `yarn add @doctools/${packageName}@${versions[packageName]}`;

  return <CodeBlock language="bash">{installationString}</CodeBlock>;
}
