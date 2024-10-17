import React from 'react';
import styles from '../stylesheets/modules/warningBanners.module.css';

function EarlyAccessWarning() {
  return (
    <div className={styles.earlyAccessWarning}>
      This functionality is available only to customers who have signed up for
      our Early Access (EA) program. Talk to your Guidewire representative to
      learn more about our eligibility criteria for EA programs. Note that EA
      capabilities may or may not become part of our future offerings.
    </div>
  );
}

function UpdatePreviewWarning() {
  return (
    <div className={styles.updatePreviewWarning}>
      These release notes are being shared as part of our Update Preview
      program, which helps you start planning updates before GA. The Update
      Preview is not a binding commitment to deliver any specific functionality,
      and note that Guidewire might make functional updates, resolve issues, or
      adjust the contents of the release through the GA date. Please review the
      latest release notes and Documentation at GA to make sure you have the
      latest product functionality.
    </div>
  );
}

export async function addWarningBanners() {
  if (!window.docEarlyAccess && !window.docUpdatePreview) {
    return;
  }

  const article = document.querySelector('article');
  if (!article) {
    return;
  }
  const warningContainer = document.createElement('div');
  warningContainer.classList.add('warningContainer');
  article.prepend(warningContainer);

  const { createRoot } = await import('react-dom/client');
  const root = createRoot(warningContainer);
  root.render(
    <>
      {window.docEarlyAccess && <EarlyAccessWarning />}
      {window.docUpdatePreview && <UpdatePreviewWarning />}
    </>
  );
}
