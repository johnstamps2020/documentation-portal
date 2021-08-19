const fetch = require('node-fetch');

function getParas(items) {
  const textBlocks = [];
  items.forEach(item => {
    item.split('\n').forEach(block => {
      if (block.length > 0) {
        if (block.startsWith('URL')) {
          block = block.substring(block.indexOf(' ') + 1);
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: 'URL',
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: ': ',
                type: 'text',
              },
              {
                text: block,
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: block,
                    },
                  },
                ],
              },
            ],
          });
        } else if (block.startsWith('Reported issues')) {
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: 'Reported issues',
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: ':',
                type: 'text',
              },
            ],
          });

          block = block.substring(block.indexOf(': ') + 2);
          const issues = block.split(',');
          const listItems = [];
          for (const issue of issues) {
            listItems.push({
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: issue,
                    },
                  ],
                },
              ],
            });
          }
          textBlocks.push({
            type: 'bulletList',
            content: listItems,
          });
        } else if (block.startsWith('Possible contacts')) {
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: 'Possible contacts',
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: ':',
                type: 'text',
              },
            ],
          });

          block = block.substring(block.indexOf(': ') + 2);
          const contacts = block.split(',');
          const listItems = [];
          for (const contact of contacts) {
            listItems.push({
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: contact,
                      marks: [
                        {
                          type: 'link',
                          attrs: {
                            href: 'mailto:' + contact,
                            title: contact,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            });
          }
          textBlocks.push({
            type: 'bulletList',
            content: listItems,
          });
        } else if (block.startsWith('Reported by')) {
          const email = block.substring(block.indexOf(': ') + 2);
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: 'Reported by',
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: ': ',
                type: 'text',
              },
              {
                text: email,
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'mailto:' + email,
                    },
                  },
                ],
              },
            ],
          });
        } else if (block.startsWith('Comment')) {
          let comment = block.substring(block.indexOf(': ') + 2);
          comment = comment.replace(/0x0A/g, '\n');
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: 'Comment',
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: ': ',
                type: 'text',
              },
            ],
          });
          textBlocks.push({
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    text: comment,
                    type: 'text',
                  },
                ],
              },
            ],
          });
        } else {
          const identifier = block.substring(0, block.indexOf(': '));
          const data = block.substring(block.indexOf(': '));
          textBlocks.push({
            type: 'paragraph',
            content: [
              {
                text: identifier,
                type: 'text',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                text: data,
                type: 'text',
              },
            ],
          });
        }
      }
    });
  });

  return textBlocks;
}

function makeSafe(string) {
  return string.replace(/"/g, "'");
}

async function sendJiraRequest(requestBody) {
  const { summaryText, descriptionText, feedbackType } = requestBody;

  let descriptionItems = [];
  for (const [label, value] of Object.entries(descriptionText)) {
    descriptionItems.push(`${label}: ${value}`);
  }

  const description = getParas(descriptionItems);
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
