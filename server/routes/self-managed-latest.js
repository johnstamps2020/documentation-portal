const selfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedLatest = (req, res, next) => {
  res.render('self-managed-latest', { categories: selfManagedCategories });
};

module.exports = selfManagedLatest;