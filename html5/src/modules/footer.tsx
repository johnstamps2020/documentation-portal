import React from 'react';
import { render } from 'react-dom';
import '../stylesheets/modules/footer.css';
import Translate from '@theme/Translate';

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
  const footerTemplate = `<div>
        <div class="footerLinks">
            <span class="footerLink">
                <a href="${
                  isOffline ? 'https://docs.guidewire.com' : ''
                }/support" ${
    isOffline ? 'target="__blank" rel="noopener noreferrer"' : ''
  }>Legal and Support Information</a>
            </span>
        </div>
        <div class="footerCopyright">
            Copyright ©${new Date().getFullYear()}
            Guidewire Software, Inc.
        </div>
    </div>`;

  const footerRight = document.getElementById('footerRight');
  footerRight.innerHTML = footerTemplate;

  const footerCenter = document.getElementById('footerCenter');
  const pubDate = footerCenter.innerText.match(/Published: (.*)/)[1];

  render(<FooterPublicationDate publicationTime={pubDate} />, footerCenter);
}
