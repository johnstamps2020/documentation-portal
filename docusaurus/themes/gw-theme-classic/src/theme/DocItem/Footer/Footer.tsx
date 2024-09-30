import React from 'react';
import { Feedback } from '@doctools/core';
import useIsBrowser from '@docusaurus/useIsBrowser';
import InitialDocItemFooter from '@theme-init/DocItem/Footer';
import { useDocContext } from '@theme/DocContext';
import { useDocItemContext } from '@theme/DocItem/DocItem';

export default function Footer(props) {
  // Context
  const isBrowser = useIsBrowser();

  const { userInformation, searchMeta, authors } = useDocContext();
  const { title } = useDocItemContext();

  const jiraApiUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081/jira'
      : isBrowser
      ? `${window.location.origin}/jira`
      : 'https://unknown.com/jira';

  const url = isBrowser
    ? window.location.href
    : 'https://unknown-URL.com/unknow-page';

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: '3rem',
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
          possibleContacts={authors.join(', ')}
        />
      </div>
      <InitialDocItemFooter {...props} />
    </>
  );
}
