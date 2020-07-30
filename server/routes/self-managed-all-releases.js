const selfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedAllReleases = (req, res, next) => {
  console.log('I am self managed all releases');
  res.render('self-managed-all-releases', { categories: selfManagedCategories });
};

module.exports = selfManagedAllReleases;