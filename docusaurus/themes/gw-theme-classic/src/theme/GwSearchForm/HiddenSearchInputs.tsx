import React from 'react';
import { useDocContext } from '@theme/DocContext';

function wrapValuesInQuotes(arr: string[]) {
  return arr.map((v) => `"${v}"`).join(',');
}

export default function HiddenSearchInputs() {
  const { searchMeta } = useDocContext();

  if (!searchMeta) {
    return null;
  }

  const { platform, product, version, release } = searchMeta;
  const isCloudDoc = platform.includes('Cloud');
  const isSelfManagedDoc = platform.includes('Self-managed');
  const releaseExists = release.length > 0;
  const versionExists = version.length > 0;
  const hiddenInputs = { platform, product };
  if (isCloudDoc && releaseExists) {
    hiddenInputs['release'] = release;
  }
  if (isSelfManagedDoc && versionExists) {
    hiddenInputs['version'] = version;
  }

  return (
    <>
      {Object.entries(hiddenInputs)
        ?.map(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            return (
              <input
                key={key}
                type="hidden"
                name={key}
                value={wrapValuesInQuotes(value)}
              />
            );
          }
        })
        .filter(Boolean)}
    </>
  );
}
