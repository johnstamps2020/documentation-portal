const express = require('express');
const router = express.Router();
const {
  getTopicRecommendations,
} = require('../controllers/recommendationsController');

router.get('/', async function(req, res) {
  const topicId = req.query.topicId;
  const topicRecommendations = await getTopicRecommendations(topicId);
  res.send(topicRecommendations);
});

module.exports = router;
