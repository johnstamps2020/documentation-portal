import React from "react";
import { CollapsibleProps } from "@theme/Collapsible";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { translate } from "@theme/Translate";

export default function Collapsible({ title, children }: CollapsibleProps) {
  return (
    <Accordion sx={{ marginBottom: "1rem" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {title ||
            translate({
              id: "collapsible.title",
              message: "Expand",
              description:
                'Describes an accordion that contains "more content" or "additional information"',
            })}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
