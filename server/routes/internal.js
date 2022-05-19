const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    const userInfo = res.locals.userInfo;
    const pageInfo = {
      userName: userInfo.name,
      userEmail: userInfo.preferred_username,
    };
    res.render('internal', { pageInfo });
  } catch (err) {
    winstonLogger.error(`Problem rendering an internal route
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
