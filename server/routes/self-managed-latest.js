const getSelfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedLatest = async (req, res, next) => {
  const selfManagedCategories = await getSelfManagedCategories();
  res.render('self-managed-latest', { categories: selfManagedCategories });
};

module.exports = selfManagedLatest;
