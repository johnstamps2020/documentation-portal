import { blue, green, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const adminDocTheme = createTheme({
  palette: {
    primary: {
      main: blue[200],
    },
    success: {
      main: green[200],
    },
    error: {
      main: red[200],
    },
  },
  typography: {
    fontFamily: [
      '"Source Sans Pro"',
      "Helvetica",
      "Arial",
      "sans - serif",
    ].join(","),
  },
  spacing: 4,
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        sx: {
          marginTop: 2,
          marginRight: 2,
          marginBottom: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
        size: "small",
        sx: {
          p: 2,
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 1,
      },
    },
    MuiSnackbar: {
      defaultProps: {
        autoHideDuration: 3000,
      },
    },
    MuiAlert: {
      defaultProps: {
        sx: { width: "100%" },
      },
    },
  },
});
