const cloudProductList = require('../controllers/cloudProductController');

const cloudHome = (req, res, next) => {
  if (req.originalUrl === '/') {
    res.render('cloud-home', { products: cloudProductList });
  } else {
    req.next();
  }
};

module.exports = cloudHome;
