exports.getDefaultSubjectIcon = function() {
  return 'fas fa-book';
};

exports.getSubjectIcon = function(categoryName) {
  const categoryMap = [
    { label: 'Features and functionality', icon: 'far fa-object-group' },
    { label: 'Installation', icon: 'fas fa-wrench' },
    { label: 'Release notes', icon: 'far fa-file-note' },
    { label: 'Administration', icon: 'fas fa-users-cog' },
    { label: 'Development', icon: 'fas fa-code' },
    { label: 'Integration', icon: 'fas fa-puzzle-piece' },
    { label: 'Configuration', icon: 'fas fa-cogs' },
    { label: 'Best practices', icon: 'far fa-lightbulb' },
    { label: 'Glossary', icon: 'fas fa-book-open' },
    { label: 'About this documentation', icon: 'fas fa-book' },
  ];

  const matchingCategory = categoryMap.find(
    cat => cat.label.toLowerCase() === categoryName.toLowerCase()
  );

  if (matchingCategory) {
    return matchingCategory.icon;
  } else {
    return getDefaultSubjectIcon();
  }
};
