import { Router } from 'express';
import { getRedirectUrl } from '../controllers/redirect';

const router = Router();
router.get('/', async function (req, res) {
  const cameFrom = req.headers?.referer || (req.query.cameFrom as string);
  if (cameFrom) {
    const { status, body } = await getRedirectUrl(res, cameFrom);
    return res.status(status).json(body);
  }
  return res.status(404).json({ message: 'Redirect URL not found' });
});

module.exports = router;
