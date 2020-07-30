const cloudProductList = require('../controllers/cloudProductController');

const cloudHome = (req, res, next) => {
  console.log('Address in BROWSER!', req.originalUrl);
  if (req.originalUrl === '/') {
    res.render('cloud-home', { products: cloudProductList });
  } else {
    req.next();
  }
};

module.exports = cloudHome;
