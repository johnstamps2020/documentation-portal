const express = require('express');
const router = express.Router();
const { winstonLogger } = require('../controllers/loggerController');
const {
  listItems,
  addItems,
  deleteItems,
} = require('../controllers/s3Controller');

const fileUpload = require('express-fileupload');
router.use(fileUpload());

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', async function(req, res, next) {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(500).send({
        message: 'Error! Path is required',
      });
    }

    const result = await listItems(path);
    return res.status(200).send({
      ...result,
    });
  } catch (err) {
    winstonLogger.error(
      `[S3 controller] Problem listing items: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(500).send({
        message: 'Error! Path is required',
      });
    }

    const { filesFromClient } = req.files;

    if (!filesFromClient) {
      return res.status(500).send({
        message: 'Error! No files attached',
      });
    }

    const result = await addItems(filesFromClient, path);
    return res.status(200).send(result);
  } catch (err) {
    winstonLogger.error(
      `[S3 controller] Problem adding an item: ${JSON.stringify(err)}`
    );
    next(err);
  }
});

router.delete('/', async function(req, res, next) {
  try {
    const { keys } = req.query;
    if (!keys) {
      return res.status(500).send({
        message: 'Error! Keys are required',
      });
    }

    const result = await deleteItems(keys);
    return res.status(200).send(result);
  } catch (err) {
    winstonLogger.error(
      `[S3 controller] Problem deleting item(s): ${JSON.stringify(err)}`
    );
    next(err);
  }
});

module.exports = router;
