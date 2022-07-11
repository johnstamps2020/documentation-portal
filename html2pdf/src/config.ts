import { join } from "path";
import { getFileContents } from "./scripts/helpers.js";

export const htmlFilesDir: string =
  process.env.HTML_FILES_DIR || join(process.cwd(), "test-files");
export const scriptsDir: string =
  process.env.SCRIPTS_DIR ||
  join(process.cwd(), "../server/static/html5/scripts");

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
