import { Router } from 'express';
import { getRedirectUrl } from '../controllers/redirectController';

const router = Router();
router.get('/', async function (req, res) {
  const { cameFrom } = req.query;
  const { status, body } = await getRedirectUrl(res, cameFrom as string);
  return res.status(status).json(body);
});

module.exports = router;
