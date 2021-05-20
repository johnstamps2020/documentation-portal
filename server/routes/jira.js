require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const getParas = items => {
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
};

router.get('', async (req, res) => {
  res.send('Hell World!!!');
});

router.post('/', async (req, res) => {
  const {
    summary,
    issueType,
    version,
    behavior,
    additional,
    reproduceSteps,
    workaround,
    issues,
    product,
    contact,
    component,
  } = req.body;

  let description = getParas([
    `Reported by: ${contact}`,
    `Originating app: ${product}`,
    behavior,
    additional,
    `Steps to reproduce: ${reproduceSteps}`,
    `Current workaround: ${workaround || 'none'}`,
    `Related issues: ${issues || 'none'}`,
  ]);

  function makeSafe(string) {
    return string.replace(/"/g, "'");
  }

  const bodyData = `{
      "fields": {
        "project": {
          "key": "JUT"
        },
        "labels": [ "${
          issueType === 'Bug' ? 'reported-issue' : 'requested-feature'
        }" ],
        "summary": "${makeSafe(summary)}",
        "description": {
          "type": "doc",
          "version": 1,
          "content": ${JSON.stringify(description)}
        },
        "issuetype": {
          "name": "${issueType}"
        },
        "components": [
          {
            "id": "${component.id}"
          }
        ],
        "versions": [
          {
            "name": "${version}"
          }
        ]
      }
    }`;

  fetch('https://guidewirejira.atlassian.net/rest/api/3/issue', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.JIRA_AUTH_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: bodyData,
  })
    .then(response => {
      return response.json();
    })
    .then(json => res.send(json))
    .catch(err => res.send(err));
});

module.exports = router;
