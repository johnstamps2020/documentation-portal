const { spawn } = require("node:child_process");
const path = require("path");
const fs = require("fs");
const { relinkHtmlFiles } = require("./scripts/relinkHtml");

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

relinkHtmlFiles(inputDir);

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}

const server = spawn("serve", [inputDir]);

server.stdout.on("data", (data) => {
  console.log(`SERVER: ${data}`);
});

server.stderr.on("data", (data) => {
  console.error(`SERVER ERROR: ${data}`);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
