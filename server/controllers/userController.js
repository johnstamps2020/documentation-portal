const mockUserData = require('./utils/mockUserData');
const { winstonLogger } = require('./loggerController');

function belongsToGuidewire(email) {
  try {
    return !!email?.endsWith('@guidewire.com');
  } catch (err) {
    winstonLogger.error(
      `Problem checking if user belongs to Guidewire
          EMAIL: ${email}
          ERROR: ${err.message}`
    );
    return false;
  }
}

function getUserInfo(req) {
  if (process.env.ENABLE_AUTH === 'no') {
    if (process.env.PRETEND_TO_BE_EXTERNAL === 'yes') {
      return mockUserData.external;
    }
    return mockUserData.internal;
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
