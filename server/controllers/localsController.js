const { getUserInfo } = require('./userController');
const { getTranslatedPages } = require('./frontendController');
const {
  tagManagerHeadScript,
  tagManagerBody,
  pendoInstallScript,
  getPendoInitializeScript,
} = require('./analyticsController');
const { winstonLogger } = require('./loggerController');

async function addCommonDataToSessionLocals(req, res) {
  try {
    res.locals.userInfo = getUserInfo(req);
    res.locals.translatedPages = await getTranslatedPages();
    res.locals.analytics = {
      tagManagerHeadScript,
      tagManagerBody,
      pendoInstallScript,
      pendoInitializeScript: getPendoInitializeScript(res.locals.userInfo),
    };
  } catch (err) {
    winstonLogger.error(
      `Problem adding commons to session locals
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

module.exports = { addCommonDataToSessionLocals };
