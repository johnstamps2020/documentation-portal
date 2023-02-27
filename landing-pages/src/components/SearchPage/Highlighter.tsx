import React, { useEffect, useState } from 'react';
import highlightIcon from '../../images/icon-highlighter.svg';
import { useSearch } from '../../context/SearchContext';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import GlobalStyles from '@mui/material/GlobalStyles';

export default function Highlighter() {
  const { searchData } = useSearch();
  const [highlight, setHighlight] = useState<string | null>(null);
  const [highlightedIcon, setHighlightedIcon] = useState(true);

  useEffect(() => {
    if (searchData) {
      setHighlight('enabled');
    } else {
      setHighlight(null);
    }
  }, [searchData]);

  function toggleHighlight(
    event: React.MouseEvent<HTMLElement>,
    highlightSearchPhrase: string | null
  ) {
    const highlightedElements = document.getElementsByClassName(
      'searchResultHighlight'
    );
    for (const highlightedElement of highlightedElements) {
      highlightedElement.classList.toggle('highlighted');
    }
    setHighlight(highlightSearchPhrase);
  }

  if (!searchData) {
    return null;
  }

  return (
    <>
      <GlobalStyles
        styles={{ '.highlighted': { backgroundColor: 'hsl(60, 100%, 77%)' } }}
      />
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={highlight}
        exclusive
        onChange={toggleHighlight}
        aria-label="Toggle highlight for search phrases"
      >
        <ToggleButton
          value="enabled"
          aria-label="highlight"
          sx={{ marginLeft: 2, padding: 0, border: 0 }}
        >
          <Tooltip title="Toggle highlight for search phrases">
            <img
              src={highlightIcon}
              alt="highlighter-icon"
              height="24px"
              onClick={() => setHighlightedIcon(!highlightedIcon)}
              style={{
                backgroundColor: highlightedIcon
                  ? 'hsl(60, 100%, 77%)'
                  : 'hsl(100, 100%, 100%)',
              }}
            />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
