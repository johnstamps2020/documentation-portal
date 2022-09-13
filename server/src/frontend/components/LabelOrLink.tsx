import React from 'react';
import { LinkProps } from '../../../types/page';

export default function LabelOrLink({ label, id, link, page }: LinkProps) {
  function getHref(): string | undefined {
    if (id) {
      return id;
    }

    if (page) {
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
