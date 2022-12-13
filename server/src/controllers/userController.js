const mockUserData = require('./utils/mockUserData');
const { winstonLogger } = require('./loggerController');
const { isLoggedInOrHasValidToken } = require('./authController');

function belongsToGuidewire(email) {
  try {
    return !!email?.endsWith('@guidewire.com');
  } catch (err) {
    winstonLogger.error(
      `Problem checking if user belongs to Guidewire
          EMAIL: ${email}
          ERROR: ${JSON.stringify(err)}`
    );
    return false;
  }
}

function getUserName(user) {
  if (user?.name) {
    return user.name;
  }

  if (user?.email) {
    return user.email.split('@')[0];
  }

  return 'Unnamed User';
}

async function getUserInfo(req) {
  try {
    let userInfo = {};
    let user = {};
    if (process.env.ENABLE_AUTH === 'no') {
      if (process.env.PRETEND_TO_BE_EXTERNAL === 'yes') {
        user = { ...mockUserData.external };
      } else {
        user = { ...mockUserData.internal };
      }

      userInfo.isLoggedIn = true;
    } else {
      user = { ...req.user };
      userInfo.isLoggedIn = await isLoggedInOrHasValidToken(req);
    }

    const { locale, email } = user;
    userInfo.hasGuidewireEmail = belongsToGuidewire(email);
    userInfo.name = getUserName(user);
    userInfo.preferred_username = email?.toLowerCase() || 'no email';
    userInfo.locale = locale;

    return userInfo;
  } catch (err) {
    winstonLogger.error(
      `Problem getting user info
          ERROR: ${err}`
    );
  }
}

module.exports = { getUserInfo };
