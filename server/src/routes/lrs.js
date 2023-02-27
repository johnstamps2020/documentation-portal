const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const {
  getAllRecords,
  getRecordsByObjectId,
  getRecordsByActorMbox,
  getRecordByObjectIdAndActorMbox,
  addRecord,
  deleteRecordByElasticId,
} = require('../controllers/lrsController');
const router = express.Router();

router.get('/', function (req, res, next) {
  try {
    res.send({
      name: 'Learning Record Store',
      company: 'Guidewire',
      message: 'The learning record store is up and running!',
      status: 200,
    });
  } catch (err) {
    winstonLogger.error(
      `Problem getting info from the LRS: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.get('/records', async function (req, res, next) {
  try {
    const { objectId, actorMbox } = req.query;

    if (objectId && actorMbox) {
      const record = await getRecordByObjectIdAndActorMbox(objectId, actorMbox);
      res.send(record);
    } else if (objectId) {
      const records = await getRecordsByObjectId(objectId);
      res.send(records);
    } else if (actorMbox) {
      const records = await getRecordsByActorMbox(actorMbox);
      res.send(records);
    } else {
      const allRecords = await getAllRecords();
      res.send(allRecords.body.hits.hits.map((h) => h._source));
    }
  } catch (err) {
    winstonLogger.error(
      `Problem getting records form the LRS: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.post('/records/add', async function (req, res, next) {
  try {
    const record = req.body;
    const result = await addRecord(record);
    res.send(result);
  } catch (err) {
    winstonLogger.error(`Problem posting to the LRS: ${JSON.stringify(err)}`);
    next(err);
  }
});

router.delete('/records/delete', async function (req, res, next) {
  try {
    const elasticId = req.query.elasticId;
    if (elasticId) {
      const result = await deleteRecordByElasticId(elasticId);
      res.send(result);
    }
  } catch (err) {
    winstonLogger.error(
      `Problem deleting a record in the LRS: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

module.exports = router;
