const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();
const {
  getTopicRecommendations,
} = require('../controllers/recommendationsController');

router.get('/', async function(req, res, next) {
  try {
    const { topicId } = req.query;
    const result = await getTopicRecommendations(topicId, req, res);
    res.status(result.status).send(result.body);
  } catch (err) {
    winstonLogger.error(`Problem getting recommendations
    ERROR: ${err.message}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
