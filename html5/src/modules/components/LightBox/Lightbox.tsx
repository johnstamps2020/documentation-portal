import React, { useRef } from "react";
import styles from "./Lightbox.module.css";

type ThumbnailProps = {
  thumbnail: string;
  showDialog: () => void;
};

function ThumbnailWithExternalButton({
  thumbnail,
  showDialog,
}: ThumbnailProps) {
  return (
    <>
      <div className={styles.thumbnailWithExternalButtonWrapper}>
        <button
          onClick={showDialog}
          className={styles.expandButton}
          title="Open full-size view"
        />
        <div dangerouslySetInnerHTML={{ __html: thumbnail }} />
      </div>
    </>
  );
}

function ClickableThumbnail({ showDialog, thumbnail }: ThumbnailProps) {
  return (
    <button
      onClick={showDialog}
      className={styles.lightboxButton}
      dangerouslySetInnerHTML={{ __html: thumbnail }}
    />
  );
}

type LightboxProps = {
  thumbnail: string;
  fullSizeElement: string;
  clickToEnlarge: boolean;
};

export default function Lightbox({
  thumbnail,
  fullSizeElement,
  clickToEnlarge,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>();

  function closeDialogWithEscapeButton(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeDialog();
    }
  }

  function showDialog() {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeDialogWithEscapeButton);
    dialogRef.current.showModal();
  }

  function closeDialog() {
    document.body.style.overflow = null;
    document.removeEventListener("keydown", closeDialogWithEscapeButton);
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
        {clickToEnlarge ? (
          <div
            onClick={closeDialog}
            className={styles.embiggenedImage}
            dangerouslySetInnerHTML={{ __html: fullSizeElement }}
          />
        ) : (
          <div
            className={styles.scrollBox}
            dangerouslySetInnerHTML={{ __html: fullSizeElement }}
          />
        )}
        <button
          onClick={closeDialog}
          className={styles.closeButton}
          title="Close full-size view"
        />
      </dialog>
    </>
  );
}
