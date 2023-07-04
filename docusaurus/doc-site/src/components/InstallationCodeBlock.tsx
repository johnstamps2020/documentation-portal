import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import pluginInfo from '../../../plugins/gw-plugin-redoc/package.json';
import themeInfo from '../../../themes/gw-theme-classic/package.json';

type InstallationCodeBlockProps = {
  forPlugin?: boolean;
};

export default function InstallationCodeBlock({
  forPlugin,
}: InstallationCodeBlockProps) {
  const installationString = forPlugin
    ? `yarn add @doctools/gw-plugin-redoc@${pluginInfo.version}`
    : `yarn add @doctools/gw-theme-classic@${themeInfo.version}`;

  return <CodeBlock language="bash">{installationString}</CodeBlock>;
}
