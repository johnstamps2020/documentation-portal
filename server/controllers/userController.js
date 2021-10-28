function belongsToGuidewire(email) {
  try {
    return email.endsWith('@guidewire.com');
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getUserInfo(req) {
  const isLoggedIn = req.isAuthenticated() || process.env.ENABLE_AUTH === 'no';
  const userInfo = {
    isLoggedIn: isLoggedIn,
  };
  const user = req._passport.session.user;
  if (user && user.hasOwnProperty('profile')) {
    const { name, preferred_username, locale } = user.profile;
    userInfo.hasGuidewireEmail = belongsToGuidewire(preferred_username);
    userInfo.name = name;
    userInfo.preferred_username = preferred_username;
    userInfo.locale = locale;
  }
  return userInfo;
}

module.exports = { getUserInfo };
