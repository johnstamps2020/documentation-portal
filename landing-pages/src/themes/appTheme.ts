import { createTheme } from "@mui/material";
import "@fontsource/source-sans-pro";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#00739d"
    },
    secondary: {
      main: "#3c4c5e"
    }
  },
  typography: {
    fontFamily: ["Source Sans Pro", "Helvetica", "Arial", "sans-serif"].join(
      ","
    )
  }
});
