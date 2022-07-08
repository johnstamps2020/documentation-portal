import { spawn } from "node:child_process";
import path from "path";
import fs from "fs";
import {
  relinkHtmlFiles,
  navLinkClassName,
  navLinkAttachmentPointQuery,
} from "./scripts/relinkHtml.js";
import { getServerLink, getFirstTopicPath } from "./scripts/helpers.js";

const htmlFilesDir =
  process.env.HTML_FILES_DIR || path.join(process.cwd(), "test-files");
const scriptsDir =
  process.env.SCRIPTS_DIR ||
  path.join(process.cwd(), "../server/static/html5/scripts");

const inputDir = path.join(process.cwd(), "in");
const outputDir = path.join(process.cwd(), "out");

if (!fs.existsSync(htmlFilesDir) || !fs.existsSync(scriptsDir)) {
  console.error(`Base input folder does not exist: ${htmlFilesDir}`);
  process.exit(1);
}

if (fs.existsSync(inputDir)) {
  fs.rmSync(inputDir, { recursive: true });
}

fs.cpSync(htmlFilesDir, inputDir, { recursive: true });
fs.cpSync(scriptsDir, path.join(inputDir, "scripts"), { recursive: true });

console.log("Modifying HTML input files");
relinkHtmlFiles(inputDir);
console.log("Input files converted successfully");

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir, { recursive: true });

const server = spawn("serve", [inputDir]);

server.stdout.on("data", (data) => {
  console.log(`SERVER: ${data}`);
  if (data.includes("Accepting connections")) {
    console.log("Convert to PDF!");

    const firstTopicServerPath = getServerLink(getFirstTopicPath(inputDir));

    const converter = spawn("mr-pdf", [
      `--initialDocURLs=http://localhost:3000${firstTopicServerPath}`,
      `--paginationSelector=${navLinkAttachmentPointQuery} > a.${navLinkClassName}`,
      `--contentSelector=main`,
      `--outputPDFFilename=out/index.pdf`,
    ]);

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
