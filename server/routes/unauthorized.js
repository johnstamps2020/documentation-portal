const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

/* GET unauthorized page. */
router.get('/', function(req, res, next) {
  try {
    const pageInfo = {
      cameFrom: req.headers.referer,
    };
    res.render('unauthorized', { pageInfo });
  } catch (err) {
    winstonLogger.error(`Problem rendering the "unauthorized" page
    ERROR: ${err.message}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
