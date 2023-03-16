import { Router } from 'express';
import { getTopicRecommendations } from '../controllers/recommendationsController';

const router = Router();

router.get('/', async function (req, res) {
  const { status, body } = await getTopicRecommendations(req, res);
  return res.status(status).json(body);
});

module.exports = router;
