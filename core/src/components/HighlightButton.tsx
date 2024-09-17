import BorderColorIcon from '@mui/icons-material/BorderColor';
import IconButton from '@mui/material/IconButton';
import Mark from 'mark.js';
import React, { useEffect, useState } from 'react';
import { translate } from '../lib';
import Tooltip from '@mui/material/Tooltip';

type HighlightButtonProps = {
  words: string[];
  activeColor: string;
  inactiveColor: string;
};

function getBodyElement(): HTMLElement | null {
  const ditaArticle = document.querySelector(
    'main[role="main"]'
  ) as HTMLElement;
  const docusaurusArticle = document.querySelector(
    'main article'
  ) as HTMLElement;
  const fallbackArticle = document.querySelector('body') as HTMLElement;

  return ditaArticle || docusaurusArticle || fallbackArticle;
}

export function HighlightButton({
  words,
  activeColor,
  inactiveColor,
}: HighlightButtonProps) {
  const [wordsToHighlight, setWordsToHighlight] = useState<string[]>(words);

  useEffect(() => {
    const bodyElement = getBodyElement();
    if (!bodyElement) {
      return;
    }
    const markInstance = new Mark(bodyElement);
    markInstance.unmark();

    if (wordsToHighlight.length > 0) {
      for (const word of wordsToHighlight) {
        markInstance.mark(word);
      }
    }
  }, [wordsToHighlight]);

  function toggleHighlights() {
    setWordsToHighlight((prevWords) => {
      if (prevWords.length > 0) {
        return [];
      }
      return words;
    });
  }

  return (
    <Tooltip
      title={translate({
        id: 'docHighlighter.tooltip',
        message: 'Toggle highlight for search phrases',
      })}
      placement="top"
    >
      <IconButton
        aria-label={translate({
          id: 'docHighlighter.label',
          description:
            'If the user opens the page from the search window, the search words are highlighted. This button turns the highlights on and off.',
          message: 'toggle highlights',
        })}
        sx={{
          color: wordsToHighlight.length > 0 ? activeColor : inactiveColor,
        }}
        onClick={toggleHighlights}
      >
        <BorderColorIcon />
      </IconButton>
    </Tooltip>
  );
}
