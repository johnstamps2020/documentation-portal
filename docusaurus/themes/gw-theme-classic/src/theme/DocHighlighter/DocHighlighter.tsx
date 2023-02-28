import React, { useEffect, useState } from 'react';
import { translate } from '@theme/Translate';
import './DocHighlighter.css';
import Mark from 'mark.js';
import IconButton from '@mui/material/IconButton';
import HighlightIcon from '@mui/icons-material/Highlight';
import { useTheme } from '@mui/material/styles';
import { useHistory } from '@docusaurus/router';

const label = translate({
  id: 'docHighlighter.label',
  description:
    'If the user opens the page from the search window, the search words are highlighted. This button turns the highlights on and off.',
  message: 'toggle highlights',
});

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
  const [highlighting, setHighlighting] = useState(false);
  const theme = useTheme();
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

  useEffect(
    function () {
      if (words?.length > 0) {
        setHighlighting(true);
        const article = document.querySelector('article');
        const instance = new Mark(article);
        for (const word of words) {
          instance.mark(word);
        }
      }
    },
    [words]
  );

  useEffect(
    function () {
      document.querySelector('body').classList.toggle('disableHighlights');
    },
    [highlighting]
  );

  function toggleHighlights() {
    setHighlighting(!highlighting);
  }

  if (!words) {
    return null;
  }

  return (
    <IconButton
      onClick={toggleHighlights}
      aria-label={label}
      title={label}
      sx={{
        color: highlighting ? '#ffff8a' : theme.palette.background.default,
      }}
    >
      <HighlightIcon />
    </IconButton>
  );
}
