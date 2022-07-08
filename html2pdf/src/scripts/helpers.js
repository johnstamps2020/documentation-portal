import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

export function getAllHtmlFiles(dirPath) {
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

export function getServerLink(href) {
  return "/" + href.replace(/\.\.\//g, "");
}

export function getDocumentFromFile(filePath) {
  const contents = fs.readFileSync(filePath, { encoding: "utf8" });
  const dom = new JSDOM(contents);
  const { document } = dom.window;

  return document;
}

export function getFirstTopicPath(dirPath) {
  const indexFilePath = path.join(dirPath, "index.html");
  const document = getDocumentFromFile(indexFilePath);

  const firstHref = document.querySelector("a").getAttribute("href");
  return firstHref;
}
