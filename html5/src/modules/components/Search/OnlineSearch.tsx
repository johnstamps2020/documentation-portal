import React from 'react';
import HiddenInput from './HiddenInput';
import SearchInput from './SearchInput';

export default function OnlineSearch() {
  return (
    <SearchInput>
      <HiddenInput name="doc_title" value={window.docTitle} />
      <HiddenInput name="platform" value={window.docPlatform} />
      <HiddenInput name="product" value={window.docProduct} />
      <HiddenInput name="version" value={window.docVersion} />
      {window.docSubject && (
        <HiddenInput name="subject" value={window.docSubject} />
      )}
    </SearchInput>
  );
}
