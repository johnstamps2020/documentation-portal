import React, { useRef, useState } from 'react';
import Dialog from './Dialog';
import styles from './Lightbox.module.css';

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
  elementOuterHtml?: string;
  children?: JSX.Element | JSX.Element[];
  clickToEnlarge?: boolean;
};

export default function Lightbox({
  thumbnail,
  elementOuterHtml,
  clickToEnlarge,
  children,
}: LightboxProps) {
  const [open, setOpen] = useState(false);

  function showDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
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
      <Dialog
        closeOnClick={clickToEnlarge}
        handleClose={closeDialog}
        elementOuterHtml={elementOuterHtml}
        open={open}
      >
        {children}
      </Dialog>
    </>
  );
}
