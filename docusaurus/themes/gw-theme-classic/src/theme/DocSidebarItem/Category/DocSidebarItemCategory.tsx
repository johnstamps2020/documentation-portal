import React from 'react';
import InitialDocSidebarItemCategory from '@theme-init/DocSidebarItem/Category';
import { usePluginData } from '@docusaurus/useGlobalData';
import { internalNavItemClass } from '@theme/Internal/InternalWrapper';
import { chain } from 'lodash';
import { PluginData } from '@theme/Types';
import { PLUGIN_NAME } from '../../../types/constants';

export default function DocSidebarItemCategory(props) {
  const { internalDocIds } = usePluginData(PLUGIN_NAME) as PluginData;
  const childIds = chain(props.item.items)
    .flatten()
    .map('docId')
    .filter(Boolean)
    .value();

  const isInternalOnly =
    childIds.length > 0 && !childIds.some((id) => !internalDocIds.includes(id));

  return (
    <div className={isInternalOnly ? internalNavItemClass : undefined}>
      <InitialDocSidebarItemCategory {...props} />
    </div>
  );
}
