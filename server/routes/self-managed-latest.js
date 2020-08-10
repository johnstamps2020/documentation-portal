const getSelfManagedCategories = require('../controllers/selfManagedProductController');

const selfManagedLatest = async (req, res, next) => {
  try {
    const selfManagedCategories = await getSelfManagedCategories();
    res.render('self-managed-latest', { categories: selfManagedCategories });
  } catch (err) {
    next(err);
  }
};

module.exports = selfManagedLatest;
