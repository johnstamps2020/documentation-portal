import React from 'react';
import InitialDocSidebarItemLink from '@theme-init/DocSidebarItem/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { internalNavItemClass } from '@theme/Internal/InternalWrapper';
import { PluginData } from '@theme/Types';
import { PLUGIN_NAME } from '../../../types/constants';

export default function DocSidebarItemLink(props) {
  const { internalDocIds } = usePluginData(PLUGIN_NAME) as PluginData;
  const isInternal = internalDocIds.includes(props.item.docId);

  return (
    <div className={isInternal ? internalNavItemClass : undefined}>
      <InitialDocSidebarItemLink {...props} />
    </div>
  );
}
