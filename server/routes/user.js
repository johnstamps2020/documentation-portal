const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  const isLoggedIn = req.isAuthenticated() || process.env.ENABLE_AUTH === 'no';
  const user = req.userContext;
  let name = undefined;

  if (user) {
    name = user.userinfo.name;
  }
  res.send({
    isLoggedIn: isLoggedIn,
    name: name,
  });
});

module.exports = router;
