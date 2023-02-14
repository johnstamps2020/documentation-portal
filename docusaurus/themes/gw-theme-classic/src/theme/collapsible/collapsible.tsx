import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./collapsible.module.css";

export default function Collapsible({ title, children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <details
      className={clsx("admonition", "admonition-important", "alert--info")}
    >
      <summary
        className={styles.title}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <div
          className={clsx(
            styles.titleChevron,
            collapsed ? styles.collapsed : styles.expanded
          )}
        ></div>
        {title}
      </summary>
      {!collapsed && <div className={styles.content}>{children}</div>}
    </details>
  );
}
