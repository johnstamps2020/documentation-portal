"use strict";
import {
  getAllHtmlFiles,
  getServerLink,
  getDocumentFromFile,
} from "./helpers.js";
import { writeFileSync } from "fs";
import { basename } from "path";

export const navLinkClassName = "nextLink";
export const navLinkAttachmentPointQuery = "body";
export const contentSelector = "main";

function getCurrentLink(document, filePath) {
  const query = `nav a[href*="${basename(filePath)}"]`;
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
  console.log("Modifying HTML input files");
  const allHtmlFiles = getAllHtmlFiles(inputDir);
  allHtmlFiles.forEach((filePath) => {
    if (filePath.endsWith("index.html")) {
      return;
    }

    const document = getDocumentFromFile(filePath);

    addNavigationLink(document, filePath);

    writeFileSync(filePath, document.documentElement.outerHTML, {
      encoding: "utf8",
    });
  });
  console.log("Input files converted successfully");
}
