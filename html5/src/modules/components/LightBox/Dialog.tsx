import React, { useEffect, useRef } from "react";
import styles from "./Lightbox.module.css";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  closeOnClick: boolean;
  elementOuterHtml?: string;
  children?: JSX.Element | JSX.Element[];
};

export default function Dialog({
  open,
  handleClose,
  closeOnClick,
  elementOuterHtml,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>();

  function closeDialogWithEscapeButton(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  useEffect(
    function () {
      if (open) {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", closeDialogWithEscapeButton);
        dialogRef.current.showModal();
      }

      return () => {
        document.body.style.overflow = null;
        document.removeEventListener("keydown", closeDialogWithEscapeButton);
        dialogRef.current.close();
      };
    },
    [open]
  );

  console.log("From inside the dialog", { open });

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div
        onClick={closeOnClick && handleClose}
        className={styles.embiggenedImage}
        dangerouslySetInnerHTML={
          elementOuterHtml && { __html: elementOuterHtml }
        }
      >
        {children}
      </div>
      <button
        onClick={handleClose}
        className={styles.closeButton}
        title="Close full-size view"
      />
    </dialog>
  );
}
