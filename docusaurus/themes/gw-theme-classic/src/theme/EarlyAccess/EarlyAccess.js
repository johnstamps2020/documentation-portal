import React from "react";
import styles from "./EarlyAccess.module.css";
import { useDocContext } from "@theme/DocContext";

export default function EarlyAccess() {
  const { isEarlyAccess } = useDocContext();

  if (!isEarlyAccess) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      This functionality is available only to customers who have signed up for
      our Early Access (EA) program. Talk to your Guidewire representative to
      learn more about our eligibility criteria for EA programs. Note that EA
      capabilities may or may not become part of our future offerings.
    </div>
  );
}
