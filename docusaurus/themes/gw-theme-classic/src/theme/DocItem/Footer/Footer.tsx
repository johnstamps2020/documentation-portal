import React from "react";
import InitialDocItemFooter from "@theme-init/DocItem/Footer";
import Feedback from "@theme/Feedback";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { useDocContext } from "@theme/DocContext";

export default function Footer(props) {
  // Context
  const isBrowser = useIsBrowser();
  const { userInformation, searchMeta } = useDocContext();

  const jiraApiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8081/jira"
      : isBrowser
      ? `${window.location.origin}/jira`
      : "https://unknown.com/jira";

  const title = isBrowser
    ? document.querySelector("title").innerHTML
    : "Unknown title";

  const url = isBrowser
    ? window.location.href
    : "https://unknown-URL.com/unknow-page";

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: "3rem",
        }}
        className="feedback"
      >
        <Feedback
          jiraApiUrl={jiraApiUrl}
          searchMeta={searchMeta}
          showLabel={true}
          title={title}
          url={url}
          userInformation={userInformation}
        />
      </div>
      <InitialDocItemFooter {...props} />
    </>
  );
}
