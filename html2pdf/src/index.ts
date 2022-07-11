import { spawn } from "node:child_process";
import {
  relinkHtmlFiles,
  navLinkClassName,
  navLinkAttachmentPointQuery,
  contentSelector,
} from "./scripts/relinkHtml.js";
import {
  getServerLink,
  getFirstTopicPath,
  getMrPdfCommandLineParameters,
} from "./scripts/helpers.js";
import {
  footerTemplate,
  headerTemplate,
  inputDir,
  logoPath,
} from "./config.js";
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
      contentSelector: contentSelector,
      outputPDFFilename: `out/index.pdf`,
      footerTemplate: footerTemplate,
      headerTemplate: headerTemplate,
      pdfMargin: "100,50,100,50",
      coverTitle: process.env.DOC_TITLE || "A Tale of Two Cities",
      coverImage: logoPath,
    });

    const converter = spawn("mr-pdf", parameters);

    converter.stdout.on("data", (data) => {
      console.log(`CONVERTER: ${data}`);
    });

    converter.stderr.on("data", (data) => {
      console.error(`CONVERTER ERROR: ${data}`);
      server.kill();
      throw new Error(`Conversion error: ${data}`);
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
  throw new Error(`Server error: ${data}`);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
