const express = require('express');
const router = express.Router();
const {
  getTopicRecommendations,
} = require('../controllers/recommendationsController');

router.get('/', async function(req, res) {
  const topicId = req.query.topicId;
  const result = await getTopicRecommendations(topicId, req);
  res.status(result.status).send(result.body);
});

module.exports = router;
