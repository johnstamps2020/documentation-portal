import React from 'react';
import MarkdownWrapper from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Markdown.css';

type MarkdownProps = {
  contents: string;
};

export function Markdown({ contents }: MarkdownProps) {
  return (
    <MarkdownWrapper remarkPlugins={[remarkGfm]}>{contents}</MarkdownWrapper>
  );
}
