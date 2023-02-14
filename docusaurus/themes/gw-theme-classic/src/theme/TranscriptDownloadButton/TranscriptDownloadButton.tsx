import React from "react";
import Translate from "@theme/Translate";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

export default function TranscriptDownloadLink({
  transcript,
  ariaLabelForDownload,
}) {
  return (
    <Button href={transcript} endIcon={<DownloadIcon />} download>
      <Translate id="transcriptDownloadLink.label">
        Download transcript
      </Translate>
    </Button>
  );
}
