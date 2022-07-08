import { join } from "path";
import { getFileContents } from "./scripts/helpers.js";

export const htmlFilesDir: string =
  process.env.HTML_FILES_DIR || join(process.cwd(), "test-files");
export const scriptsDir: string =
  process.env.SCRIPTS_DIR ||
  join(process.cwd(), "../server/static/html5/scripts");

export const inputDir: string = join(process.cwd(), "in");
export const outputDir: string = join(process.cwd(), "out");

const templatesDir = join(process.cwd(), "src/templates");
const headerPath = join(templatesDir, "header.html");
const footerPath = join(templatesDir, "footer.html");
const cssPath = join(templatesDir, "pdfStyle.css");

export const headerTemplate = getFileContents(headerPath);
export const footerTemplate = getFileContents(footerPath);
export const cssTemplate = getFileContents(cssPath);
