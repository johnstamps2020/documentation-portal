import { Router } from 'express';
import { getRedirectUrl } from '../controllers/redirectController';

const router = Router();
router.get('/', async function (req, res) {
  const { cameFrom } = req.query;
  // cameFrom = pathname with slashes
  const { status, body } = await getRedirectUrl(res, cameFrom as string);
  switch (status) {
    case 200:
      return res.redirect(body.redirectStatusCode, body.redirectUrl);
    case 404:
      return res.redirect(`/404?notFound=${cameFrom}`);
    default:
      break;
  }
});

module.exports = router;
