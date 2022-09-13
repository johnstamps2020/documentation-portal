import React from 'react';
import LabelOrLink from './LabelOrLink';

export default function PageItem({ href, label, class: className, items }) {
  return (
    <div className={className}>
      <LabelOrLink label={label} href={href} />
      {items && items.map((item, key) => <PageItem {...item} key={key} />)}
    </div>
  );
}
