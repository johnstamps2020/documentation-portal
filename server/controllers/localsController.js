const { getUserInfo } = require('./userController');
const { getTranslatedPages } = require('./frontendController');
const {
  tagManagerHeadScript,
  tagManagerBody,
  pendoInstallScript,
  getPendoInitializeScript,
} = require('./analyticsController');

function addCommonDataToSessionLocals(req, res) {
  res.locals.userInfo = getUserInfo(req);
  res.locals.translatedPages = getTranslatedPages();
  res.locals.analytics = {
    tagManagerHeadScript,
    tagManagerBody,
    pendoInstallScript,
    pendoInitializeScript: getPendoInitializeScript(res.locals.userInfo),
  };
}

module.exports = { addCommonDataToSessionLocals };
