import iconGlossary from 'images/icon-glossary.svg';
import React from 'react';
import HeaderMenuDesktop from './HeaderMenuDesktop';

export default function GlossaryDesktop() {
  return (
    <HeaderMenuDesktop
      title="Glossary"
      hideTitle
      iconSrc={iconGlossary}
      id="glossary"
      items={[
        {
          href: '/glossary',
          children: 'Guidewire Glossary',
        },
      ]}
    />
  );
}
