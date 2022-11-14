import { createTheme } from "@mui/material";

export const searchPageTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(0, 116, 158)"
    }
  },
  typography: {
    fontFamily: ["Source Sans Pro", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h1: {
      fontSize: 40,
      textAlign: "left",
      color: "black",
      fontWeight: 600,
      marginRight: "auto"
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.375rem",
      color: "rgb(0, 116, 158)",
      textAlign: "left",
      paddingBottom: "16px"
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.125rem",
      padding: "0.5rem 0",
      color: "black"
    },
    body1: {
      padding: "1rem 0",
      lineHeight: "24px",
      textAlign: "left"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        body: { padding: 0 },
        ".highlighted": {
          backgroundColor: "hsl(60, 100%, 77%)"
        }
      })
    },
    MuiAccordionSummary: {
      defaultProps: {
        sx: {
          fontSize: "0.85rem",
          fontWeight: 600,
          textTransform: "uppercase",
          flexDirection: "row-reverse",
          padding: 0
        }
      }
    },
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        sx: {
          boxShadow: 0,
          border: 0,
          "&:before": {
            display: "none",
            maxHeight: "40px"
          }
        }
      }
    },
    MuiAccordionDetails: {
      defaultProps: {
        sx: {
          marginLeft: "6px",
          textAlign: "left"
        }
      }
    },
    MuiFormGroup: {
      defaultProps: {
        sx: {
          gap: "8px"
        }
      }
    },
    MuiFormControlLabel: {
      defaultProps: {
        disableTypography: true,
        sx: {
          lineHeight: "14px",
          textAlign: "left",
          marginRight: "8px",
          fontSize: "0.85rem"
        }
      }
    },
    MuiCheckbox: {
      defaultProps: {
        sx: {
          height: "14px"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        sx: {
          fontSize: "0.65rem"
        }
      }
    },
    MuiButtonGroup: {
      defaultProps: {
        sx: {
          justifyContent: "center",
          marginBottom: "8px",
          gap: "6px"
        }
      }
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
        sx: {
          fontSize: "0.875rem",
          paddingBottom: "0.25rem"
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        sx: { padding: "0.2rem 0" }
      }
    },
    MuiBadge: {
      defaultProps: {
        max: 10000
      }
    }
  }
});
