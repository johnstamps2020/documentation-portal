import React from 'react';

type HeadMetaProps = {
  content: string;
  name: string;
};

export const guidewireMetaPrefix = 'com.guidewire.metadata:';

export function HeadMetaTag({ name, content }: HeadMetaProps) {
  return <meta name={`${guidewireMetaPrefix}${name}`} content={content} />;
}
