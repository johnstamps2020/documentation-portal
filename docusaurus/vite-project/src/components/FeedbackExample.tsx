import Feedback from '@theme/Feedback';
import { SearchMeta } from '@theme/Types';
import { UserInformation } from '@theme/Types';

export default function FeedbackExample() {
  const jiraApiUrl = `${window.location.origin}/jira`;
  const title = 'Vite test';
  const url = window.location.href;
  const searchMeta: SearchMeta = {
    docTitle: 'unset',
    docInternal: false,
    docEarlyAccess: false,
    product: ['Vite'],
    platform: ['MacOS'],
    version: ['latest'],
    release: ['unknown'],
    subject: ['unknown'],
  };
  const userInformation: UserInformation = {
    hasGuidewireEmail: true,
    isLoggedIn: true,
    name: 'Sergio InBlanco',
    preferred_username: 'sinblanco@guidewire.com',
  };
  return (
    <div>
      <h2>The feedback component</h2>
      <p>To test the API, run the doc portal on localhost too</p>
      <Feedback
        jiraApiUrl={jiraApiUrl}
        searchMeta={searchMeta}
        userInformation={userInformation}
        showLabel
        title={title}
        url={url}
        possibleContacts="pkowaluk@guidewire.com"
      />
    </div>
  );
}
