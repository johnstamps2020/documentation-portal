import { Router } from 'express';
import { getEnvInfo } from '../controllers/envController';

const router = Router();
router.get('/', function (req, res) {
  res.send(getEnvInfo());
});

module.exports = router;
