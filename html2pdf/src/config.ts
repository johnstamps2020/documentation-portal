import { join } from "path";
import { getFileContents } from "./scripts/helpers.js";

// Environment variables

export const htmlFilesDir: string =
  process.env.HTML_FILES_DIR || join(process.cwd(), "test-files");
export const scriptsDir: string =
  process.env.SCRIPTS_DIR ||
  join(process.cwd(), "../server/static/html5/scripts");
export const pdfLocale = process.env.PDF_LOCALE || "en-US";
export const pdfOutputPath = process.env.PDF_OUTPUT_PATH || `out/index.pdf`;
export const coverTitle =
  process.env.DOC_TITLE || "PolicyCenter 2022.05.1 Release Notes";

// end of environment variables

export const inputDir: string = join(process.cwd(), "in");
export const outputDir: string = join(process.cwd(), "out");
export const resourcesDir: string = join(process.cwd(), "resources");
export const logoPath: string =
  "http://localhost:3000/guidewire_logo_color_web.png";

const templatesDir = join(process.cwd(), "src/templates");
const headerPath = join(templatesDir, "header.html");
const footerPath = join(templatesDir, "footer.html");

export const headerTemplate = getFileContents(headerPath);
export const footerTemplate = getFileContents(footerPath);
