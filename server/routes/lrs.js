const express = require('express');
const { getAllRecords, addRecord } = require('../controllers/lrsController');
const router = express.Router();

router.get('/', function(req, res, next) {
  try {
    res.send({
      name: 'Learning Record Store',
      company: 'Guidewire',
      message: 'The learning record store is up and running!',
      status: 200,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/records', async function(req, res, next) {
  try {
    const { objectId, actorMbox } = req.query;

    if (objectId) {
      // implement soon
    } else if (actorMbox) {
      // implement soon
    } else {
      const allRecords = await getAllRecords();
      res.send(allRecords.body.hits.hits.map(h => h._source));
    }
  } catch (err) {
    next(err);
  }
});

router.put('/records/add', async function(req, res, next) {
  try {
    const record = req.body;
    const result = await addRecord(record);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
