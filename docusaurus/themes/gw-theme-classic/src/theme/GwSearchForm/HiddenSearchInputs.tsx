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
  const hiddenInputs = { platform, product, version, release };

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
