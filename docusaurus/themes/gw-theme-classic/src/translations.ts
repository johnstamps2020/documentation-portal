import type { TranslationFileContent } from "@docusaurus/types";
import { readFileSync } from "fs";

export function readJsonFile(fileName: string): { [id: string]: string } {
  const translationData: TranslationFileContent = JSON.parse(
    readFileSync(`${__dirname}/i18n/${fileName}`, { encoding: "utf-8" })
  );

  return Object.entries(translationData).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [key]: value.message,
    }),
    {}
  );
}
