import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ChatbotComment } from '../../../../types';

type UserQueryAccordionProps = ChatbotComment['context']['chatbotRequest'];

export function UserQueryAccordion({
  query,
  opt_in,
  ...filters
}: UserQueryAccordionProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="user-panel-content"
        id="user-panel-header"
      >
        User query
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h3">Question</Typography>
        <Typography>{query}</Typography>
        <Typography variant="h3">Filters</Typography>
        {Object.entries(filters).map(([key, value]) => (
          <Typography key={key} sx={{ display: 'block', mt: 1 }}>
            <strong>{key}:</strong> {value}
          </Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
