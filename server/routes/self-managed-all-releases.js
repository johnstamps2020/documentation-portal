const selfManagedAllReleases = async (req, res, next) => {
  try {
    res.redirect('/self-managed-latest');
  } catch (err) {
    next(err);
  }
};

module.exports = selfManagedAllReleases;
