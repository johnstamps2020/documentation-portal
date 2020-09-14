const getCloudProductList = require('../controllers/cloudProductFamilyController');

const cloudHome = async (req, res, next) => {
  try {
    const cloudProductList = await getCloudProductList();
    if (req.originalUrl === '/') {
      res.render('cloud-home', { products: cloudProductList });
    } else {
      req.next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = cloudHome;
