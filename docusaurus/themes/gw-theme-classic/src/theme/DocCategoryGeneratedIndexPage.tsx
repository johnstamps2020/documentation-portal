import React from 'react';
import InitDocCategoryGeneratedIndexPage from '@theme-init/DocCategoryGeneratedIndexPage';
import InternalLinkController from './Internal/InternalLinkController';

export default function DocCategoryGeneratedIndexPageWrapper(props) {
  return (
    <InternalLinkController>
      <InitDocCategoryGeneratedIndexPage {...props} />
    </InternalLinkController>
  );
}
