const fs = require("fs");
const path = require("path");

function getAllHtmlFiles(dirPath) {
  const namesInDir = fs.readdirSync(dirPath);
  return namesInDir
    .map((fileOrFolderName) => {
      const fullPath = path.join(dirPath, fileOrFolderName);
      if (fs.statSync(fullPath).isDirectory()) {
        return getAllHtmlFiles(fullPath);
      } else {
        if (fullPath.endsWith(".html")) {
          return fullPath;
        }
      }
    })
    .flat()
    .filter(Boolean);
}

module.exports = { getAllHtmlFiles };
