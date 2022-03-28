import ReactDOM from 'react-dom';
import React, { useRef } from 'react';
import styles from '../../stylesheets/modules/lightbox.module.css';

function Lightbox({ imgAttributes }) {
  const dialogRef = useRef();

  const imgProps = [...imgAttributes].reduce((acc, attr) => {
    acc[attr.name] =
      attr.name === 'alt' ? `${attr.value}, click to enlarge` : attr.value;
    return acc;
  }, {});

  const imgPropsForPreview = [...imgAttributes].reduce((acc, attr) => {
    if (!['width', 'height'].includes(attr.name)) {
      acc[attr.name] = attr.value;
      return acc;
    }

    return acc;
  }, {});

  function showDialog() {
    dialogRef.current.showModal();
  }

  function closeDialog() {
    dialogRef.current.close();
  }

  return (
    <>
      <button onClick={showDialog} className={styles.lightboxButton}>
        <img {...imgProps} />
      </button>
      <dialog ref={dialogRef} className={styles.dialog}>
        <div>
          <img
            {...imgPropsForPreview}
            onClick={closeDialog}
            className={styles.embiggenedImage}
          />
        </div>
        <button
          onClick={closeDialog}
          className={styles.closeButton}
          title="Close image view"
        ></button>
      </dialog>
    </>
  );
}

export function addLightbox() {
  const images = document.querySelectorAll('img');
  images.forEach((image, i) => {
    const lightboxContainer = document.createElement('div');
    lightboxContainer.id = `lightbox${i}`;
    image.before(lightboxContainer);
    ReactDOM.render(
      <Lightbox imgAttributes={image.attributes} />,
      lightboxContainer
    );
    image.remove();
  });
}
