import { createTheme } from "@mui/material";

export const twoColumnsTheme = createTheme({
  typography: {
    h1: {
      fontSize: "2em",
      textAlign: "left",
      color: "black",
      fontWeight: 600,
      marginRight: "auto",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.25rem",
      color: "hsl(216, 42%, 13%)",
      textAlign: "left",
      paddingBottom: "16px",
      marginLeft: "10px",
      marginRight: "auto",
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        style: {
          textDecoration: "none",
          paddingBottom: "10px",
          color: "hsl(196, 100%, 31%)",
        },
      },
    },
    MuiGrid2: {
      defaultProps: {
        sx: {
          "& .MuiContainer-root": {
            pl: 0,
            ml: 0,
            mr: "auto",
          },
          backgroundColor: "white",
          minHeight: "75vh",
          alignContent: "baseline",
        },
        marginLeft: "100px",
        marginRight: "auto",
        alignItems: "baseline",
        justifyContent: "left"
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "standard",
        sx: {
          marginTop: "10px",
          alignItems: "left",
          width: "300px",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        sx: {
          textAlign: "left",
          marginLeft: 0,
          marginRight: "auto",
          backgroundColor: "white",
          borderRadius: 4,
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        sx: { color: "black", fontSize: 20, fontWeight: 400 },
      },
    },
  },
});
