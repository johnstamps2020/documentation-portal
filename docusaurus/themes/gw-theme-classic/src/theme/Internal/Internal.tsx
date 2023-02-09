import React, { useEffect } from "react";
import styles from "./Internal.module.css";
import { useDocContext } from "@theme/DocContext";
import InternalPageInfo from "./InternalPageInfo";
import InternalPrompt from "./InternalPrompt";
import { InternalProps } from "@theme/Internal";

export default function Internal({
  children,
  showInfo,
  hidePrompt,
}: InternalProps) {
  const docsContext = useDocContext();
  const userInformation = docsContext.userInformation;
  const isExternalViewer = !userInformation?.hasGuidewireEmail;
  const hideMeId = "hideMe";

  useEffect(
    function () {
      if (isExternalViewer) {
        const contentToHide = document.getElementById(hideMeId);
        if (contentToHide) {
          contentToHide.style.display = "none";
        }
      }
    },
    [isExternalViewer]
  );

  if (isExternalViewer) {
    if (showInfo) {
      return (
        <>
          <InternalPageInfo />
          <div id={hideMeId}>{children}</div>
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <div>
      {!hidePrompt && <InternalPrompt />}
      <div className={hidePrompt ? undefined : styles.internalBlock}>
        {children}
      </div>
    </div>
  );
}
