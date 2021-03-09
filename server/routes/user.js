const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  const isLoggedIn = req.isAuthenticated() || process.env.ENABLE_AUTH === 'no';
  const user = req.userContext;

  if (user) {
    const { name, preferred_username, locale } = user.userinfo;
    res.send({
      isLoggedIn: isLoggedIn,
      name: name,
      preferred_username: preferred_username,
      locale: locale,
    });
  } else {
    res.send({
      isLoggedIn: isLoggedIn,
    });
  }
});

module.exports = router;
