const fetch = require('node-fetch');

function getParas(items) {
  const textBlocks = [];
  items.forEach(item => {
    item.split('\n').forEach(block => {
      if (block.length > 0) {
        textBlocks.push({
          type: 'paragraph',
          content: [
            {
              text: block,
              type: 'text',
            },
          ],
        });
      }
    });
  });

  return textBlocks;
}

function makeSafe(string) {
  return string.replace(/"/g, "'");
}

async function sendJiraRequest(requestBody) {
  const {
    summary,
    version,
    product,
    platform,
    user,
    originatingUrl,
    userComment,
    topicId,
  } = requestBody;

  let description = getParas([
    `Reported by: ${user || 'unknown'}`,
    `Product: ${product}`,
    `Platform: ${platform}`,
    `Version: ${version}`,
    `Topic ID: ${topicId || 'unknown'}`,
    `Originating URL: ${originatingUrl}`,
    `User comment: ${makeSafe(userComment)}`,
  ]);

  const bodyData = {
    fields: {
      project: {
        key: 'DOCS',
      },
      labels: ['feedback-from-doc-site'],
      summary: makeSafe(summary),
      description: {
        type: 'doc',
        version: 1,
        content: description,
      },
      issuetype: {
        name: 'User Story',
      },
      components: [
        {
          id: '11281',
        },
      ],
    },
  };

  let result;

  await fetch('https://guidewirejira.atlassian.net/rest/api/3/issue', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.JIRA_AUTH_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      result = json;
    })
    .catch(err => {
      result = err;
    });

  return result;
}

module.exports = { sendJiraRequest };
