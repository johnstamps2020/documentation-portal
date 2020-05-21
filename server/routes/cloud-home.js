const cloudProductList = require('../controllers/cloudProductController');

const cloudHome = (req, res, next) => {
  res.render('cloud-home', { products: cloudProductList });
};

module.exports = cloudHome;
