import { join } from "path";
import { existsSync, cpSync, rmSync, mkdirSync } from "fs";
import {
  htmlFilesDir,
  inputDir,
  scriptsDir,
  outputDir,
  resourcesDir,
} from "../config.js";

export function prepareFilesAndFolders() {
  if (!existsSync(htmlFilesDir) || !existsSync(scriptsDir)) {
    console.error(`Base input folder does not exist: ${htmlFilesDir}`);
    process.exit(1);
  }

  if (existsSync(inputDir)) {
    rmSync(inputDir, { recursive: true });
  }

  cpSync(htmlFilesDir, inputDir, { recursive: true });
  cpSync(scriptsDir, join(inputDir, "scripts"), {
    recursive: true,
  });
  cpSync(resourcesDir, inputDir, { recursive: true });
}

export function createOutputDir() {
  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
  }

  mkdirSync(outputDir, { recursive: true });
}
