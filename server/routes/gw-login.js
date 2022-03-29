const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('gw-login', { showLoginButton: false });
});

module.exports = router;
