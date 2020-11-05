const express = require('express');
const router = express.Router();
const {
  getSelfManagedDocumentationPageInfo,
} = require('../controllers/selfManagedDocumentationController');

router.get('/', async function(req, res, next) {
  try {
    const selfManagedDocumentationPageInfo = await getSelfManagedDocumentationPageInfo();
    res.render('self-managed-home', {
      pageInfo: selfManagedDocumentationPageInfo,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
