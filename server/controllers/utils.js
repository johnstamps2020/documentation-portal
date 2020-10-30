function getId(label) {
  return label.toLowerCase().replace(/\W/g, '-');
}

module.exports = { getId };
