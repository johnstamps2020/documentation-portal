"use strict";
import {
  getAllHtmlFiles,
  getServerLink,
  getDocumentFromFile,
} from "./helpers.js";
import fs from "fs";
import path from "path";

export const navLinkClassName = "nextLink";
export const navLinkAttachmentPointQuery = "body";

function getCurrentLink(document, filePath) {
  const query = `nav a[href*="${path.basename(filePath)}"]`;
  const matchingLink = document.querySelector(query);

  return matchingLink;
}

function createNavLink(linkObject, document) {
  if (!linkObject) {
    return;
  }
  const navLink = document.createElement("a");
  navLink.classList.add(navLinkClassName);
  const href = getServerLink(linkObject.getAttribute("href"));
  navLink.setAttribute("href", href);

  navLink.textContent = linkObject.textContent || "Unknown";

  return navLink;
}

function addNavigationLink(document, filePath) {
  const flatLinkList =
    document.querySelectorAll("nav[role='toc'] a").length > 0
      ? document.querySelectorAll("nav[role='toc'] a")
      : document.querySelectorAll("nav.toc a");
  const currentLink = getCurrentLink(document, filePath);
  let matchingIndex = undefined;
  flatLinkList.forEach((link, index) => {
    if (link === currentLink) {
      matchingIndex = index;
    }
  });
  const nextLink = createNavLink(flatLinkList[matchingIndex + 1], document);
  if (nextLink) {
    document.querySelector(navLinkAttachmentPointQuery).appendChild(nextLink);
  }
}

export function relinkHtmlFiles(inputDir) {
  const allHtmlFiles = getAllHtmlFiles(inputDir);
  allHtmlFiles.forEach((filePath) => {
    if (filePath.endsWith("index.html")) {
      return;
    }

    const document = getDocumentFromFile(filePath);

    addNavigationLink(document, filePath);

    fs.writeFileSync(filePath, document.documentElement.outerHTML, {
      encoding: "utf8",
    });
  });
}
