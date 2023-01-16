import '../../stylesheets/modules/feedback.css';
import React from 'react';
import Feedback from '@doctools/gw-theme-classic/lib/theme/Feedback/Feedback';
import { render } from 'react-dom';
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-QRTVTBY678');

function getPossibleContacts() {
  const creatorInfos = document.querySelectorAll("meta[name = 'DC.creator']");
  if (creatorInfos.length === 0) {
    return undefined;
  }
  const emails = [];
  const pattern = /[A-z]*@guidewire.com/g;
  for (const creatorInfo of creatorInfos) {
    const matches = creatorInfo.content.matchAll(pattern);
    for (const match of matches) {
      emails.push(match[0]);
    }
  }

  if (emails.length === 0) {
    return 'uknown';
  }

  return emails.join(', ');
}

export function addFeedbackElements() {
  const feedbackContainer = document.createElement('div');
  feedbackContainer.setAttribute('class', 'feedbackWrapper');

  const articleTitle = document.querySelector('h1.topictitle1');
  if (articleTitle) {
    articleTitle.classList.add('titleWithFeedback');
    articleTitle.append(feedbackContainer);
  } else {
    console.log('no articleTitle');
    return;
  }

  const jiraApiUrl = `${window.location.origin}/jira`;
  const title = document.querySelector('title').innerHTML;
  const url = window.location.href;
  const searchMeta = {
    docTitle: 'unset',
    docInternal: false,
    docEarlyAccess: false,
    product: window.docProduct.split(','),
    platform: window.docPlatform.split(','),
    version: window.docVersion.split(','),
    release: ['unknown'],
    subject: ['unknown'],
  };
  const userInformation = window.userInformation || {
    preferred_username: undefined,
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
