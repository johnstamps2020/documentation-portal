const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();

/* GET unauthorized page. */
router.get('/', function (req, res, next) {
  try {
    const pageInfo = {
      cameFrom: req.headers.referer,
    };
    res.status(401).render('unauthorized', { pageInfo });
  } catch (err) {
    winstonLogger.error(`Problem rendering the "unauthorized" page
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
