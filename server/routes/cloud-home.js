const getCloudProductList = require('../controllers/cloudProductController');

const cloudHome = async (req, res, next) => {
  const cloudProductList = await getCloudProductList();
  if (req.originalUrl === '/') {
    res.render('cloud-home', { products: cloudProductList });
  } else {
    req.next();
  }
};

module.exports = cloudHome;
