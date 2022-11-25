const fetch = require('node-fetch');
const { winstonLogger } = require('./loggerController');

function makeSafe(string) {
  return string.replace(/"/g, "'");
}

function getJiraDescription(descriptionText) {
  return Object.entries(descriptionText).map(([key, value]) => [
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: key,
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: value,
        },
      ],
    },
  ]);
}

async function sendJiraRequest(requestBody) {
  try {
    const { summaryText, descriptionText, feedbackType } = requestBody;

    const description = getJiraDescription(descriptionText).flat();
    const feedbackLabel = feedbackType === 'negative' ? 'critique' : 'kudos';

    const bodyData = {
      fields: {
        project: {
          key: 'DOCS',
        },
        labels: ['feedback-from-doc-site', `${feedbackLabel}-feedback`],
        summary: makeSafe(summaryText),
        description: {
          type: 'doc',
          version: 1,
          content: description,
        },
        issuetype: {
          name: 'Action Item',
        },
        components: [
          {
            id: '12320',
          },
        ],
      },
    };

    const response = await fetch(
      'https://guidewirejira.atlassian.net/rest/api/3/issue',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.JIRA_AUTH_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Response is not OK. ${responseText}`);
    }

    return responseText;
  } catch (err) {
    winstonLogger.error(
      `Problem sending JIRA request
          BODY: ${JSON.stringify(requestBody)}
          ERROR: ${err}`
    );
    return `[Error in Jira controller] ${err}`;
  }
}

module.exports = { sendJiraRequest };
