const express = require('express');
const router = express.Router();

router.get('/', async function(req, res) {
  res.send('I will get info about all the builds');
});

router.get('/:buildId', async function(req, res) {
  const { buildId } = req.params;
  res.send(`I will get info about build with ID ${buildId}`);
});

module.exports = router;
