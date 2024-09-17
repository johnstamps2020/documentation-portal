import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React from 'react';
import { ChatbotComment } from '../../../../types';
import ChatSources from '../../ChatSources';
import { Markdown } from '../../Markdown';

type UserQueryAccordionProps = ChatbotComment['context']['chatbotMessage'];

export function ChatResponseAccordion({
  message,
  sources,
}: UserQueryAccordionProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="chat-panel-content"
        id="chat-panel-header"
      >
        Chat response
      </AccordionSummary>
      <AccordionDetails>
        <ChatSources sources={sources} />
        <Markdown contents={message || ''} />
      </AccordionDetails>
    </Accordion>
  );
}
