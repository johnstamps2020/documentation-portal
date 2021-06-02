require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sendJiraRequest } = require('../controllers/jiraController');

router.post('/', async (req, res) => {
  const result = await sendJiraRequest(req.body);
  console.log('JIRA RESULT', result);
  res.send(result);
});

module.exports = router;
