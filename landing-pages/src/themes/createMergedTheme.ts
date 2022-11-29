import { createTheme, ThemeOptions } from "@mui/material/styles";
import { merge } from "lodash";

export function createMergedTheme(theme: any, themeOptions: ThemeOptions) {
  return createTheme(merge(theme, themeOptions));
}
