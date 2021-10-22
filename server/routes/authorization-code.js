const express = require('express');
const router = express.Router();

router.get('/callback', function(req, res) {
  const callbackData = req.session.grant.response;
  res.send('OK');
});

module.exports = router;
