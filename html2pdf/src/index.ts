import { spawn } from "node:child_process";
import { existsSync, rmSync, mkdirSync } from "fs";
import {
  relinkHtmlFiles,
  navLinkClassName,
  navLinkAttachmentPointQuery,
} from "./scripts/relinkHtml.js";
import {
  getServerLink,
  getFirstTopicPath,
  getMrPdfCommandLineParameters,
  getFileContents,
} from "./scripts/helpers.js";
import { footerTemplatePath, inputDir } from "./config.js";
import {
  createOutputDir,
  prepareFilesAndFolders,
} from "./scripts/fileSystem.js";

prepareFilesAndFolders();
relinkHtmlFiles(inputDir);

createOutputDir();

const server = spawn("serve", [inputDir]);

server.stdout.on("data", (data) => {
  console.log(`SERVER: ${data}`);
  if (data.includes("Accepting connections")) {
    console.log("Convert to PDF!");
    const firstTopicServerPath = getServerLink(getFirstTopicPath(inputDir));
    const parameters = getMrPdfCommandLineParameters({
      initialDocURLs: `http://localhost:3000${firstTopicServerPath}`,
      paginationSelector: `${navLinkAttachmentPointQuery} > a.${navLinkClassName}`,
      contentSelector: `main`,
      outputPDFFilename: `out/index.pdf`,
      footerTemplate: getFileContents(footerTemplatePath),
      pdfMargin: "30,30,30,30",
    });

    const converter = spawn("mr-pdf", parameters);

    converter.stdout.on("data", (data) => {
      console.log(`CONVERTER: ${data}`);
    });

    converter.stderr.on("data", (data) => {
      console.error(`CONVERTER ERROR: ${data}`);
    });

    converter.on("close", (code) => {
      console.log(`Converter process exited with code ${code}`);
      console.log("Conversion finished");
      server.kill();
    });
  }
});

server.stderr.on("data", (data) => {
  console.error(`SERVER ERROR: ${data}`);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
