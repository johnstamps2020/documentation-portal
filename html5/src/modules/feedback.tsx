import "../stylesheets/modules/feedback.css";
import React from "react";
import { render } from "react-dom";
import { SearchMeta, UserInformation } from "@theme/Types";
import Feedback from "@theme/Feedback";

declare global {
  interface Window {
    docProduct: string;
    docPlatform: string;
    docVersion: string;
    userInformation: UserInformation;
  }
}

function getPossibleContacts() {
  const creatorInfos = document.querySelectorAll("meta[name = 'DC.creator']");
  if (creatorInfos.length === 0) {
    return undefined;
  }
  const emails = [];
  const pattern = /[A-z]*@guidewire.com/g;
  for (const creatorInfo of Array.from(creatorInfos)) {
    const matches = creatorInfo.getAttribute("content").matchAll(pattern);
    for (const match of matches) {
      emails.push(match[0]);
    }
  }

  if (emails.length === 0) {
    return "unknown";
  }

  return emails.join(", ");
}

export function addFeedbackElements() {
  const feedbackContainer = document.createElement("div");
  feedbackContainer.setAttribute("class", "feedbackWrapper");

  const articleTitle = document.querySelector("h1.topictitle1");
  if (articleTitle) {
    articleTitle.classList.add("titleWithFeedback");
    articleTitle.append(feedbackContainer);
  } else {
    console.log("no articleTitle");
    return;
  }

  const jiraApiUrl = `${window.location.origin}/jira`;
  const title = document.querySelector("title").innerHTML;
  const url = window.location.href;
  const searchMeta: SearchMeta = {
    docTitle: "unset",
    docInternal: false,
    docEarlyAccess: false,
    product: window.docProduct?.split(",") || ["unknown"],
    platform: window.docPlatform?.split(",") || ["unknown"],
    version: window.docVersion?.split(",") || ["unknown"],
    release: ["unknown"],
    subject: ["unknown"],
  };
  const userInformation = window.userInformation || {
    preferred_username: "unknown",
  };

  const possibleContacts = getPossibleContacts();

  render(
    <Feedback
      jiraApiUrl={jiraApiUrl}
      searchMeta={searchMeta}
      showLabel={false}
      title={title}
      url={url}
      userInformation={userInformation}
      possibleContacts={possibleContacts}
    />,
    feedbackContainer
  );
}
