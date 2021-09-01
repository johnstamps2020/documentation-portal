const express = require('express');
const {
  getAllRecords,
  getRecordsByObjectId,
  getRecordsByActorMbox,
  getRecordByObjectIdAndActorMbox,
  addRecord,
} = require('../controllers/lrsController');
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

    if (objectId && actorMbox) {
      const record = await getRecordByObjectIdAndActorMbox(objectId, actorMbox);
      res.send(record.body.hits?.hits[0]?._source || {});
    } else if (objectId) {
      const records = await getRecordsByObjectId(objectId);
      res.send(records.body.hits?.hits?.map(h => h._source) || []);
    } else if (actorMbox) {
      const records = await getRecordsByActorMbox(actorMbox);
      res.send(records.body.hits?.hits?.map(h => h._source) || []);
    } else {
      const allRecords = await getAllRecords();
      res.send(allRecords.body.hits.hits.map(h => h._source));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/records/add', async function(req, res, next) {
  try {
    const record = req.body;
    const result = await addRecord(record);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
