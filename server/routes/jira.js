require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sendJiraRequest } = require('../controllers/jiraController');
const { winstonLogger } = require('../controllers/loggerController');

router.post('/', async (req, res, next) => {
  try {
    const result = await sendJiraRequest(req.body);
    console.log('JIRA RESULT', result);
    res.send(result);
  } catch (err) {
    winstonLogger.error(`Problem posting to Jira
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
