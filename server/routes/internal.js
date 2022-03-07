const express = require('express');
const { getUserInfo } = require('../controllers/userController');
const router = express.Router();

router.get('/', function(req, res, next) {
  const userInfo = getUserInfo(req);
  const pageInfo = {
    userName: userInfo.name,
    userEmail: userInfo.preferred_username,
  };
  res.render('internal', { pageInfo });
});

module.exports = router;
