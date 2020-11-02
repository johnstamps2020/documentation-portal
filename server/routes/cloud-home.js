const getCloudDocumentationPageInfo = require('../controllers/cloudDocumentationController')
  .getCloudDocumentationPageInfo;

const cloudHome = async (req, res, next) => {
  try {
    const cloudProductPageInfo = await getCloudDocumentationPageInfo();
    if (req.originalUrl === '/') {
      res.render('cloud-home', { cloudProductPageInfo: cloudProductPageInfo });
    } else {
      req.next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cloudHome;
