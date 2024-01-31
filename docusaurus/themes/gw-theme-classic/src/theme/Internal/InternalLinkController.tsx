import React, { useEffect } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import { PLUGIN_NAME } from '../../types/constants';
import { PluginData } from '../../types';
import { internalNavItemClass } from './InternalWrapper';

type InternalLinkControllerProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function InternalLinkController({
  children,
}: InternalLinkControllerProps) {
  const wrapperId = `internalLinkControllerWrapper-${new Date().getTime()}`;
  const { internalDocIds } = usePluginData(PLUGIN_NAME) as PluginData;

  useEffect(() => {
    if (internalDocIds.length > 0) {
      for (const internalDocId of internalDocIds) {
        const wrapperNode = document.getElementById(wrapperId);
        if (!wrapperNode) {
          return;
        }
        const docLinks = wrapperNode.querySelectorAll(
          `a[href*="${internalDocId}"]`
        );
        if (docLinks) {
          docLinks.forEach((docLink) => {
            docLink.classList.add(internalNavItemClass);
          });
        }
      }
    }
  }, [internalDocIds]);

  return <div id={wrapperId}>{children}</div>;
}
