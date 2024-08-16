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
  conversation_history,
  ...filters
}: UserQueryAccordionProps) {
  const filtersToDisplay = Object.entries(filters).filter(
    (item) => item[1].length > 0
  );

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="user-panel-content"
        id="user-panel-header"
      >
        {query.slice(0, 40)}
        {query.length > 39 ? '...' : ''}
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h3">Question</Typography>
        <Typography>{query}</Typography>
        <Typography variant="h3">Filters</Typography>
        {filtersToDisplay.length === 0
          ? 'No filters selected'
          : filtersToDisplay.map(
              ([key, value]) =>
                value.length > 0 && (
                  <Typography key={key} sx={{ display: 'block', mt: 1 }}>
                    <strong>{key}:</strong> {value}
                  </Typography>
                )
            )}
      </AccordionDetails>
    </Accordion>
  );
}
