import { Router } from 'express';
import { prepareDocs } from '../controllers/deltaDocController';
const router = Router();

router.get('/results', async function (req, res, next) {
  const firstDocId = req.query.firstDocId as string;
  const secondDocId = req.query.secondDocId as string;
  if (firstDocId && secondDocId) {
    const { status, body } = await prepareDocs({ firstDocId, secondDocId });
    return res.status(status).json(body);
  } else {
    return res.status(400).json('Please provide parameters in the URL');
  }
});

module.exports = router;
