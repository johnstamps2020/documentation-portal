const config = require('../config.json');
const categoryMappings = require('../controllers/categoryMappings');
const ignoredCategories = ['Core', 'Data', 'Digital'];

const getCategoryMapping = (categoryName) => {
    return categoryMappings.find(mapping => mapping.name == categoryName)
}

const cloudHome = (req, res, next) => {
  const allCategories = config.docs
    .map(doc => {
      if (doc.metadata.platform == 'Cloud') {
        return doc.metadata.category;
      }
    })
    .filter(Boolean);

  const flatCategories = [].concat.apply([], allCategories);
  let categoryNames = [];
  flatCategories.forEach(category => {
    if (
      !categoryNames.includes(category) &&
      !ignoredCategories.includes(category)
    ) {
      categoryNames.push(category);
    }
  });

  const categoryObjects = categoryNames.map(name => {
      return getCategoryMapping(name)
  });
  res.render('cloud-home', { categories: categoryObjects });
};

module.exports = cloudHome;
