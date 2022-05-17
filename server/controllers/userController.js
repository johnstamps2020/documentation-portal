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
  try {
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
      const { name, locale, email } = user;
      userInfo.hasGuidewireEmail = belongsToGuidewire(email);
      userInfo.name = name;
      userInfo.preferred_username = email.toLowerCase();
      userInfo.locale = locale;
    }
    return userInfo;
  } catch (err) {
    winstonLogger.error(
      `Problem getting user info
          ERROR: ${err.message}`
    );
  }
}

module.exports = { getUserInfo };
