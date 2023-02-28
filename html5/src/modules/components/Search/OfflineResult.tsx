import React from 'react';
import Fuse from 'fuse.js';
import { SearchItem } from './OfflineSearch';

type OfflineResultProps = {
  result: Fuse.FuseResult<SearchItem>;
};

export default function OfflineResult({ result }: OfflineResultProps) {
  const { title, body, file } = result.item;
  const previewLength = 200;
  return (
    <div>
      <h2>
        <a href={`/${file}`}>{title}</a>
      </h2>
      <div>
        {body.trim().substring(0, previewLength)}
        {body.trim().length > previewLength && '...'}
      </div>
    </div>
  );
}
