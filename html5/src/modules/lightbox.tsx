import React from "react";
import Lightbox from "./components/LightBox/Lightbox";

export async function addLightbox() {
  const lightboxElements = document.querySelectorAll("img, table");
  if (lightboxElements) {
    const { render } = await import("react-dom");
    lightboxElements.forEach((lightboxElem, i) => {
      const lightboxContainer = document.createElement("span");
      lightboxContainer.id = `lightbox${i}`;
      lightboxElem.before(lightboxContainer);
      const thumbnail = lightboxElem.outerHTML;
      const thumbnailDeepCopy = lightboxElem.cloneNode(true) as Element;
      const isImage = lightboxElem.tagName.toLowerCase() === "img";
      if (isImage) {
        ["width", "height"].forEach((attrName) =>
          thumbnailDeepCopy.removeAttribute(attrName)
        );
      }
      const fullSizeElement = thumbnailDeepCopy.outerHTML;
      render(
        <Lightbox
          thumbnail={thumbnail}
          elementOuterHtml={fullSizeElement}
          clickToEnlarge={isImage}
        />,
        lightboxContainer
      );
      lightboxElem.remove();
    });
  }
}
