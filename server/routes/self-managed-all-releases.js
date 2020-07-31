const getSelfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedAllReleases = async (req, res, next) => {
  const selfManagedCategories = await getSelfManagedCategories();
  console.log('I am self managed all releases');
  res.render('self-managed-all-releases', { categories: selfManagedCategories });
};

module.exports = selfManagedAllReleases;