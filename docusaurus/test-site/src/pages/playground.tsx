import React from 'react';
import Layout from '@theme/Layout';
import Internal from '@theme/Internal';
import { Right, Wrong, RightWrong } from '@theme/RightWrong';
import Feedback from '@theme/Feedback';
import { SearchMeta, UserInformation } from '@theme/Types';

const mockSearchMeta: SearchMeta = {
  docEarlyAccess: false,
  docInternal: false,
  docTitle: 'Thoughts and musings',
  platform: ['Cloud'],
  product: ['Doctools'],
  release: ['Banff'],
  subject: ['Configuration'],
  version: ['latest'],
};

const mockUserInformation: UserInformation = {
  hasGuidewireEmail: true,
  isLoggedIn: true,
  name: 'James User',
  preferred_username: 'juser@guidewire.com',
};

export default function Playground() {
  return (
    <Layout
      title="Playground"
      description="Theme components displayed on the page"
    >
      <div
        style={{
          paddingTop: '3rem',
          paddingBottom: '3rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
          margin: '0 auto',
          maxWidth: '1200px',
        }}
      >
        <h1>Theme components</h1>
        <h2>Internal</h2>
        <Internal>This content is internal</Internal>
        <h2>Right/wrong</h2>
        <RightWrong>
          <Right>
            <p>Select a repair facility</p>
            <p>You can edit this document</p>
          </Right>
          <Wrong>
            <p>A repair facility selection is required.</p>
            <p>This document can be edited by you.</p>
          </Wrong>
        </RightWrong>
        <h2>Feedback</h2>
        <Feedback
          jiraApiUrl="/jira"
          searchMeta={mockSearchMeta}
          showLabel
          title="Playground"
          url="https://docs.guidewire.com"
          userInformation={mockUserInformation}
        />
      </div>
    </Layout>
  );
}
