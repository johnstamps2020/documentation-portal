const fs = require('fs');
const path = require('path');
const staticPagesDir = path.join(__dirname, '..', 'static', 'pages');

async function getPage(req, res, next) {
  const configFilePath = path.join(staticPagesDir, req.path, 'index.json');
  const configFileExists = fs.existsSync(configFilePath);
  if (configFileExists) {
    const fileContents = fs.readFileSync(configFilePath, 'utf-8');
    const fileContentsJson = JSON.parse(fileContents);
    const templateName = fileContentsJson.template;
    res.render(templateName, { pageConfig: fileContentsJson });
  } else {
    next();
  }
}

module.exports = { getPage };
