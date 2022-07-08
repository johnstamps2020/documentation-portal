import { readdirSync, statSync, readFileSync } from "fs";
import * as path from "path";
import { JSDOM } from "jsdom";

export function getAllHtmlFiles(dirPath) {
  const namesInDir = readdirSync(dirPath);
  return namesInDir
    .map((fileOrFolderName) => {
      const fullPath = path.join(dirPath, fileOrFolderName);
      if (statSync(fullPath).isDirectory()) {
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
  const contents = readFileSync(filePath, { encoding: "utf8" });
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

type MrPdfParameters = {
  initialDocURLs: string;
  contentSelector: string;
  paginationSelector: string;
  excludeURLs?: string;
  excludeSelectors?: string;
  cssStyle?: string;
  outputPDFFilename?: string;
  pdfMargin?: string;
  pdfFormat?: string;
  disableTOC?: string;
  coverTitle?: string;
  coverImage?: string;
  coverSub?: string;
  headerTemplate?: string;
  footerTemplate?: string;
};

export function getMrPdfCommandLineParameters(parameters: MrPdfParameters) {
  return Object.entries(parameters).map(([key, value]) => `--${key}=${value}`);
}
