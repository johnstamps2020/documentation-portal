import React from 'react';

export default function LabelOrLink({ label, href }) {
  if (href) {
    return <a href={href}>{label}</a>;
  }

  if (label) {
    return <div className="label">{label}</div>;
  }

  return null;
}
