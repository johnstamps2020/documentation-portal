const getSelfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedAllReleases = async (req, res, next) => {
  try {
    const selfManagedCategories = await getSelfManagedCategories();
    res.render('self-managed-all-releases', {
      categories: selfManagedCategories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = selfManagedAllReleases;
