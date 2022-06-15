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
    const userInfo = getUserInfo(req);
    res.locals.userInfo = userInfo;
    res.locals.translatedPages = await getTranslatedPages();
    res.locals.analytics = {
      tagManagerHeadScript,
      tagManagerBody,
      pendoInstallScript,
      pendoInitializeScript: getPendoInitializeScript(),
    };
  } catch (err) {
    winstonLogger.error(
      `Problem adding commons to session locals
          ERROR: ${JSON.stringify(err)}`
    );
  }
}

module.exports = { addCommonDataToSessionLocals };
