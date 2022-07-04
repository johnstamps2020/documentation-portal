const { getAllHtmlFiles } = require("./fsHelpers");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

function relinkHtmlFiles(inputDir) {
  const allHtmlFiles = getAllHtmlFiles(inputDir);
  allHtmlFiles.forEach((filePath) => {
    if (filePath.endsWith("index.html")) {
      return;
    }

    const contents = fs.readFileSync(filePath, { encoding: "utf8" });
    const dom = new JSDOM(contents);
    const { document } = dom.window;

    function removeNodesByQuery(queries) {
      queries.forEach((query) => {
        const matchedNode = document.querySelector(query);
        matchedNode.remove();
      });
    }

    removeNodesByQuery([
      'script[src="/scripts/html5.js"]',
      "nav.toc",
      "footer",
      "header",
    ]);
    fs.writeFileSync(filePath, dom.window.document.documentElement.outerHTML, {
      encoding: "utf8",
    });
  });
}

module.exports = { relinkHtmlFiles };
