const express = require('express');
const router = express.Router();
const { getConfig } = require('../controllers/configController');
const { winstonLogger } = require('../controllers/loggerController');
const { listItems } = require('../controllers/s3Controller');

router.get('/', async function(req, res, next) {
  try {
    const { path } = req.query;

    if (!path) {
      res.status(500).send({
        message: 'Error! Path is required',
      });
    }

    const result = await listItems(path);
    res.status(200).send({
      result,
    });
  } catch (err) {
    winstonLogger.error(
      `[SAFE CONFIG] Problem sending config from ${req.url}: ${JSON.stringify(
        err
      )}`
    );
    next(err);
  }
});

module.exports = router;
