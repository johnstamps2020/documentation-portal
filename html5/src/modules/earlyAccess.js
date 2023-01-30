import React from "react";
import styles from "../stylesheets/modules/earlyAccess.module.css";

function EarlyAccessWarning() {
  return (
    <>
      <div className={styles.earlyAccessWarning}>
        This functionality is available only to customers who have signed up for
        our Early Access (EA) program. Talk to your Guidewire representative to
        learn more about our eligibility criteria for EA programs. Note that EA
        capabilities may or may not become part of our future offerings.
      </div>
    </>
  );
}

export async function addEarlyAccessMark() {
  if (window.docEarlyAccess) {
    const { render } = await import("react-dom");
    const warningContainer = document.createElement("div");
    const article = document.querySelector("article");
    article.prepend(warningContainer);
    React.createElement("div");
    render(<EarlyAccessWarning />, warningContainer);
  }
}
