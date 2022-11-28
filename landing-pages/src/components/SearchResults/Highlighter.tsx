import React, { useEffect, useState } from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import { useSearch } from "../../context/SearchContext";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";

export default function Highlighter() {
  const { searchData } = useSearch();
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    if (searchData) {
      setHighlight("enabled");
    } else {
      setHighlight(null);
    }
  }, [searchData]);

  function toggleHighlight(
    event: React.MouseEvent<HTMLElement>,
    highlightSearchPhrase: string | null
  ) {
    const highlightedElements = document.getElementsByClassName(
      "searchResultHighlight"
    );
    for (const highlightedElement of highlightedElements) {
      highlightedElement.classList.toggle("highlighted");
    }
    setHighlight(highlightSearchPhrase);
  }

  if (!searchData) {
    return null;
  }

  return (
    <>
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
          sx={{ marginLeft: 2 }}
        >
          <Tooltip title="Toggle highlight for search phrases">
            <HighlightIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
