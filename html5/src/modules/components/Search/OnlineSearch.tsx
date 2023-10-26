import React from 'react';
import HiddenInput from './HiddenInput';
import SearchInput from './SearchInput';

export default function OnlineSearch() {
  return (
    <SearchInput>
      {window.docPlatform.includes('Cloud') && window.docRelease && (
        <HiddenInput name="release" value={window.docRelease} />
      )}
      {window.docPlatform.includes('Self-managed') && window.docVersion && (
        <HiddenInput name="version" value={window.docVersion} />
      )}
      <HiddenInput name="platform" value={window.docPlatform} />
      <HiddenInput name="product" value={window.docProduct} />
      <HiddenInput name="language" value={window.docLanguage || 'en'} />
    </SearchInput>
  );
}
