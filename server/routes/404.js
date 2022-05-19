const express = require('express');
const router = express.Router();
const { getRedirectUrl } = require('../controllers/404');
const { winstonLogger } = require('../controllers/loggerController');

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    const cameFrom = req.headers?.referer;
    const redirectUrl = cameFrom ? getRedirectUrl(cameFrom) : undefined;
    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      const pageInfo = {
        cameFrom: cameFrom,
        appBaseUrl: process.env.APP_BASE_URL,
      };
      res.render('404', { pageInfo });
    }
  } catch (err) {
    winstonLogger.error(
      `Problem rendering the 404 page, if you can believe that. 
        ERROR: ${err.message}
        REQUEST: ${JSON.stringify(req)}`
    );
    next(err);
  }
});

module.exports = router;
