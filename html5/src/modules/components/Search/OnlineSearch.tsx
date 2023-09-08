import React from 'react';
import HiddenInput from './HiddenInput';
import SearchInput from './SearchInput';

export default function OnlineSearch() {
  return (
    <SearchInput>
      <HiddenInput name="platform" value={window.docPlatform} />
      <HiddenInput name="product" value={window.docProduct} />
      <HiddenInput name="version" value={window.docVersion} />
      <HiddenInput name="language" value={window.docLanguage || 'en'} />
    </SearchInput>
  );
}
