const getCloudProductPageInfo = require('../controllers/cloudDocumentationController')
  .getCloudProductPageInfo;

const cloudHome = async (req, res, next) => {
  try {
    const cloudProductPageInfo = await getCloudProductPageInfo();
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
