const express = require('express');
const router = express.Router();
const configIndexName = 'server-config';
const { getDocs } = require('../controllers/configController');

router.get('/', async function(req, res, next) {
  try {
    const docs = await getDocs(
      {
        query: {
          match_all: {},
        },
      },
      configIndexName
    );
    res.send(docs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
