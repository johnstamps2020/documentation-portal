import React from 'react';
import { LinkProps } from '../../../types/page';

export default function LabelOrLink({ label, id, link, page }: LinkProps) {
  function getHref(): string | undefined {
    if (id) {
      // TO DO: Implement functionality
      return id;
    }

    if (page) {
      // FIX: creates a broken link
      return new URL(page, window.location.href).toString();
    }

    if (link) {
      return link;
    }
  }

  const href = getHref();

  if (href) {
    return (
      <div>
        <a href={href}>{label}</a>
      </div>
    );
  }

  if (label) {
    return <div className="label">{label}</div>;
  }

  return null;
}
