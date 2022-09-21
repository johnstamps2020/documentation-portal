const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    res.render('gw-login', { showLoginButton: false });
  } catch (err) {
    winstonLogger.error(`Problem rendering the login page (gw-login):
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
