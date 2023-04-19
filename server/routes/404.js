const express = require('express');
const router = express.Router();
const { getRedirectUrl } = require('../controllers/404');
const { winstonLogger } = require('../controllers/loggerController');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const cameFrom = req.headers?.referer;
    const redirectUrl = cameFrom ? await getRedirectUrl(cameFrom) : undefined;
    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      const pageInfo = {
        cameFrom: cameFrom,
        appBaseUrl: process.env.APP_BASE_URL,
      };
      return res.status(404).render('404', { pageInfo });
    }
  } catch (err) {
    winstonLogger.error(
      `Problem rendering the 404 page, if you can believe that. 
        ERROR: ${JSON.stringify(err)}
        REQUEST: ${JSON.stringify(req)}`
    );
    next(err);
  }
});

module.exports = router;
