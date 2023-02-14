import clsx from "clsx";
import React from "react";
import styles from "./RightWrong.module.css";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { RightWrongCardProps } from "@theme/RightWrong";

export function Right({ children, title }: RightWrongCardProps) {
  return (
    <div className={clsx(styles.right, styles.card)}>
      <div className={styles.cardTitle}>
        <span className={styles.iconWrapper}>
          <DoneIcon sx={{ color: "white", fontSize: "1.5rem" }} />
        </span>
        <span>{title || "Do"}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Wrong({ children, title }: RightWrongCardProps) {
  return (
    <div className={clsx(styles.wrong, styles.card)}>
      <div className={styles.cardTitle}>
        <span className={styles.iconWrapper}>
          <CloseIcon sx={{ color: "white", fontSize: "1.5rem" }} />
        </span>
        <span>{title || "Don't"}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export function RightWrong({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}
