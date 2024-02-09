import BorderColorIcon from '@mui/icons-material/BorderColor';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { useSearchData } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import { HighlightButton } from '@doctools/components';

export default function Highlighter() {
  const { searchData, isLoading, isError } = useSearchData();
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    if (searchData) {
      setHighlight('enabled');
    } else {
      setHighlight(null);
    }
  }, [searchData]);

  function toggleHighlight() {
    const highlightedElements = document.getElementsByClassName(
      'searchResultHighlight'
    );
    for (const highlightedElement of highlightedElements) {
      highlightedElement.classList.toggle('highlighted');
    }
    setHighlight((prev) => (prev === 'enabled' ? null : 'enabled'));
  }

  if (!searchData || isLoading) {
    return (
      <Skeleton variant="rectangular" sx={{ width: '25px', height: '24px' }} />
    );
  }

  if (isError || searchData.totalNumOfResults === 0) {
    return null;
  }

  return (
    <>
      <GlobalStyles
        styles={{
          '.highlighted': { fontWeight: 700 },
        }}
      />
      <Tooltip title="Toggle highlight for search phrases" placement="top">
        <IconButton
          aria-label="Toggle highlight for search phrases"
          sx={{
            height: '24px',
            color: highlight ? 'black' : 'disabled',
          }}
          onClick={toggleHighlight}
        >
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
