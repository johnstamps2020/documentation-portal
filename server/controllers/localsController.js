const { getUserInfo } = require('./userController');
const { getTranslatedPages } = require('./frontendController');

function addCommonDataToSessionLocals(req, res) {
  res.locals.userInfo = getUserInfo(req);
  res.locals.translatedPages = getTranslatedPages();
}

module.exports = { addCommonDataToSessionLocals };
