const getCloudDocumentationPageInfo = require('../controllers/cloudDocumentationController')
  .getCloudDocumentationPageInfo;

const cloudHome = async (req, res, next) => {
  try {
    const cloudProductPageInfo = await getCloudDocumentationPageInfo();
    if (req.originalUrl === '/') {
      res.render('cloud-home', {
        title: cloudProductPageInfo.title,
        productFamilies: cloudProductPageInfo.productFamilies,
        selectedRelease: cloudProductPageInfo.availableReleases[0],
        availableReleases: cloudProductPageInfo.availableReleases,
      });
    } else {
      req.next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cloudHome;
