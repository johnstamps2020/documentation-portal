const express = require('express');
const router = express.Router();

function belongsToGuidewire(email) {
  try {
    const isGuidewire = email.endsWith('@guidewire.com');
    return isGuidewire;
  } catch (err) {
    console.error(err);
    return false;
  }
}

router.get('/', function(req, res) {
  const isLoggedIn = req.isAuthenticated() || process.env.ENABLE_AUTH === 'no';
  const user = req.userContext;

  if (user) {
    const { name, preferred_username, locale } = user.userinfo;
    const hasGuidewireEmail = belongsToGuidewire(preferred_username);
    res.send({
      isLoggedIn: isLoggedIn,
      hasGuidewireEmail: hasGuidewireEmail,
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
