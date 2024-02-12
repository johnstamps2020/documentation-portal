import { HighlightButton } from '@doctools/components';
import { useHistory } from '@docusaurus/router';
import React, { useEffect, useState } from 'react';
import './DocHighlighter.css';

function getWordList(urlSearchParams: URLSearchParams): string[] {
  const params = Object.fromEntries(urlSearchParams.entries());
  const hl = params.hl;
  if (hl) {
    const wordsToHighlight = hl.split(',');
    if (wordsToHighlight.length > 0) {
      return wordsToHighlight;
    }
  }

  return undefined;
}

export default function DocHighlighter() {
  const [words, setWords] = useState<string[] | undefined>(undefined);
  const { location } = useHistory();

  useEffect(
    function () {
      const wordsToHighlight = getWordList(
        new URLSearchParams(location.search)
      );
      setWords(wordsToHighlight);
    },
    [location]
  );

  if (!words) {
    return null;
  }

  return (
    <HighlightButton words={words} activeColor="yellow" inactiveColor="white" />
  );
}
