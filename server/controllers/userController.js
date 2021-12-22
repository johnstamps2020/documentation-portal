function belongsToGuidewire(email) {
  try {
    return email.endsWith('@guidewire.com');
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getUserInfo(req) {
  if (process.env.ENABLE_AUTH === 'no') {
    return {
      isLoggedIn: true,
      hasGuidewireEmail: true,
      name: 'Alfred Lord Tennyson',
      preferred_username: 'atennyson@guidewire.com',
      locale: 'en-US',
    };
  }

  const isLoggedIn = req.session.requestIsAuthenticated;
  const userInfo = {
    isLoggedIn: isLoggedIn,
  };
  const user = req.user;
  if (user) {
    const { name, preferred_username, locale } = user;
    userInfo.hasGuidewireEmail = belongsToGuidewire(preferred_username);
    userInfo.name = name;
    userInfo.preferred_username = preferred_username;
    userInfo.locale = locale;
  }
  return userInfo;
}

module.exports = { getUserInfo };
