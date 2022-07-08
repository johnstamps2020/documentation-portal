import { spawn } from "node:child_process";
import {join} from "path";
import {existsSync, cpSync, rmSync, mkdirSync} from "fs";
import {
  relinkHtmlFiles,
  navLinkClassName,
  navLinkAttachmentPointQuery,
} from "./scripts/relinkHtml.js";
import { getServerLink, getFirstTopicPath } from "./scripts/helpers.js";

const htmlFilesDir =
  process.env.HTML_FILES_DIR || join(process.cwd(), "test-files");
const scriptsDir =
  process.env.SCRIPTS_DIR ||
  join(process.cwd(), "../server/static/html5/scripts");

const inputDir = join(process.cwd(), "in");
const outputDir = join(process.cwd(), "out");

if (!existsSync(htmlFilesDir) || !existsSync(scriptsDir)) {
  console.error(`Base input folder does not exist: ${htmlFilesDir}`);
  process.exit(1);
}

if (existsSync(inputDir)) {
  rmSync(inputDir, { recursive: true });
}

cpSync(htmlFilesDir, inputDir, { recursive: true });
cpSync(scriptsDir, join(inputDir, "scripts"), { recursive: true });

console.log("Modifying HTML input files");
relinkHtmlFiles(inputDir);
console.log("Input files converted successfully");

if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });

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
