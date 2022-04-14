import React, { useRef } from 'react';
import styles from '../../stylesheets/modules/lightbox.module.css';

function ThumbnailWithExternalButton({ thumbnail, showDialog }) {
  return (
    <>
      <div>
        <button
          onClick={showDialog}
          className={styles.expandButton}
          title="Open full-size view"
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: thumbnail }} />
    </>
  );
}

function ClickableThumbnail({ showDialog, thumbnail }) {
  return (
    <button
      onClick={showDialog}
      className={styles.lightboxButton}
      dangerouslySetInnerHTML={{ __html: thumbnail }}
    />
  );
}

function Lightbox({ thumbnail, fullSizeElement, clickToEnlarge }) {
  const dialogRef = useRef();

  function showDialog() {
    document.body.style.overflow = 'hidden';
    dialogRef.current.showModal();
  }

  function closeDialog() {
    document.body.style.overflow = null;
    dialogRef.current.close();
  }

  return (
    <>
      {clickToEnlarge ? (
        <ClickableThumbnail showDialog={showDialog} thumbnail={thumbnail} />
      ) : (
        <ThumbnailWithExternalButton
          showDialog={showDialog}
          thumbnail={thumbnail}
        />
      )}
      <dialog ref={dialogRef} className={styles.dialog}>
        <div
          onClick={closeDialog}
          className={
            clickToEnlarge ? styles.embiggenedImage : styles.embiggenedTable
          }
          dangerouslySetInnerHTML={{ __html: fullSizeElement }}
        />
        <button
          onClick={closeDialog}
          className={styles.closeButton}
          title="Close full-size view"
        />
      </dialog>
    </>
  );
}

export async function addLightbox() {
  const lightboxElements = document.querySelectorAll('img, table');
  if (lightboxElements) {
    const { render } = await import('react-dom');
    lightboxElements.forEach((lightboxElem, i) => {
      const lightboxContainer = document.createElement('span');
      lightboxContainer.id = `lightbox${i}`;
      lightboxElem.before(lightboxContainer);
      const thumbnail = lightboxElem.outerHTML;
      const thumbnailDeepCopy = lightboxElem.cloneNode(true);
      const isImage = lightboxElem.tagName.toLowerCase() === 'img';
      if (isImage) {
        ['width', 'height'].forEach(attrName =>
          thumbnailDeepCopy.removeAttribute(attrName)
        );
      }
      const fullSizeElement = thumbnailDeepCopy.outerHTML;
      render(
        <Lightbox
          thumbnail={thumbnail}
          fullSizeElement={fullSizeElement}
          clickToEnlarge={isImage}
        />,
        lightboxContainer
      );
      lightboxElem.remove();
    });
  }
}
