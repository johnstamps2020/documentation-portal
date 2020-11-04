const getConfig = require('../controllers/configController');
const {
  getUniqueInMetadataArrays,
  getSortedVersions,
} = require('../routes/helpers/metadata');

const cloudHome = async (req, res, next) => {
  try {
    const serverConfig = await getConfig();
    const docs = serverConfig.docs.filter(
      doc =>
        doc.metadata.platform.includes('Cloud') &&
        doc.displayOnLandingPages !== false
    );
    const highestCloudRelease = getSortedVersions(
      getUniqueInMetadataArrays(docs, 'release')
    )[0];
    if (req.originalUrl === '/') {
      res.redirect(`/${highestCloudRelease}`);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cloudHome;
