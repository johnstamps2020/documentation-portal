const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  const userInfo = res.locals.userInfo;
  const pageInfo = {
    userName: userInfo.name,
    userEmail: userInfo.preferred_username,
  };
  res.render('internal', { pageInfo });
});

module.exports = router;
