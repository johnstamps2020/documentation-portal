const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController');

router.get('/', function(req, res) {
  const userInfo = getUserInfo(req);
  res.send(userInfo);
});

module.exports = router;
