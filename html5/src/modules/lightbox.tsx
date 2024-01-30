import React from 'react';
import Lightbox from './components/LightBox/Lightbox';
import { createRoot } from 'react-dom/client';

export async function addLightbox() {
  const lightboxElements = document.querySelectorAll('img, table');
  if (lightboxElements) {
    lightboxElements.forEach((lightboxElem, i) => {
      const lightboxContainer = document.createElement('span');
      lightboxContainer.id = `lightbox${i}`;
      lightboxElem.before(lightboxContainer);
      const thumbnail = lightboxElem.outerHTML;
      const thumbnailDeepCopy = lightboxElem.cloneNode(true) as Element;
      const isImage = lightboxElem.tagName.toLowerCase() === 'img';
      if (isImage) {
        ['width', 'height'].forEach((attrName) =>
          thumbnailDeepCopy.removeAttribute(attrName)
        );
      }
      const fullSizeElement = thumbnailDeepCopy.outerHTML;
      const lightboxRoot = createRoot(lightboxContainer);
      lightboxRoot.render(
        <Lightbox
          thumbnail={thumbnail}
          elementOuterHtml={fullSizeElement}
          clickToEnlarge={isImage}
        />
      );
      lightboxElem.remove();
    });
  }
}
