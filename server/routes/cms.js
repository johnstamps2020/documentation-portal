const express = require('express');
const { winstonLogger } = require('../controllers/loggerController');
const router = express.Router();
const { getSimpleDoc } = require('../controllers/cmsController');

router.get('/:docId/:contentId', async function(req, res, next) {
  try {
    const { docId, contentId } = req.params;
    const simpleDoc = await getSimpleDoc(docId, contentId);
    res.render('simple-doc', {
      simpleDoc: simpleDoc,
    });
  } catch (err) {
    winstonLogger.error(`Problem getting content
    ERROR: ${JSON.stringify(err)}
    REQ: ${JSON.stringify(req)}`);
    next(err);
  }
});

module.exports = router;
