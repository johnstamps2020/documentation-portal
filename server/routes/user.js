const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController');

router.get('/', function(req, res, next) {
  try {
    const userInfo = getUserInfo(req);
    res.send(userInfo);
  } catch (err) {
    winstonLogger.error(`Problem sending user info
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
