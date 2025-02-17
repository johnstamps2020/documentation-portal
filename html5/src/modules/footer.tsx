import { Translate, translate } from '@doctools/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../stylesheets/modules/footer.css';

type FooterPublicationDateProps = {
  publicationTime: string;
};

function FooterPublicationDate({
  publicationTime,
}: FooterPublicationDateProps) {
  return (
    <div id="publicationTime">
      <Translate id="footer.published">Published:</Translate> {publicationTime}
    </div>
  );
}

export function addFooterContents(isOffline: boolean) {
  const footerLegalText = translate({
    id: 'footer.legal.linktext',
    message: 'Legal and support information',
  });
  const footerLeftTemplate = `<div class="footerCopyright">
  © ${new Date().getFullYear()}
  Guidewire Software, Inc.
</div>`;
  const footerRightTemplate = `<div>
        <div class="footerLinks">
            <span class="footerLink">
                <a href="${
                  isOffline ? 'https://docs.guidewire.com' : ''
                }/support" ${
    isOffline ? 'target="__blank" rel="noopener noreferrer"' : ''
  }>${footerLegalText}</a>
            </span>
        </div>
    </div>`;

  const footerLeft = document.getElementById('footerLeft');
  footerLeft.innerHTML = footerLeftTemplate;
  const footerRight = document.getElementById('footerRight');
  footerRight.innerHTML = footerRightTemplate;

  const footerCenter = document.getElementById('footerCenter');
  const pubDate = footerCenter.innerText.match(/Published: (.*)/)[1];
  const lang = document.documentElement.lang;
  const pubDateFormatted = Intl.DateTimeFormat([lang, 'en-US'], {
    dateStyle: 'long',
    timeStyle: 'long',
  }).format(Date.parse(pubDate));
  const regex = /(\d\d:\d\d):\d\d/;
  const pubDateFormattedNoSeconds = pubDateFormatted.replace(regex, '$1');
  const root = createRoot(footerCenter!);
  root.render(
    <FooterPublicationDate publicationTime={pubDateFormattedNoSeconds} />
  );
}
