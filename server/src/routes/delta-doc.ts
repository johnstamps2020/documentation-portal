import { Router } from 'express';
import { prepareDocs } from '../controllers/deltaDocController';
const router = Router();

router.get('/results', async function (req, res, next) {
  const releaseA = req.query.releaseA as string;
  const releaseB = req.query.releaseB as string;
  const url = req.query.url as string;
  if (releaseA && releaseB && url) {
    const { status, body } = await prepareDocs({
      releaseA,
      releaseB,
      url,
    });
    return res.status(status).json(body);
  } else {
    return res.status(400).json('Please provide parameters in the URL');
  }
});

module.exports = router;
