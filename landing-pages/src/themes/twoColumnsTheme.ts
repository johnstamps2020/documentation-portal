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
      marginLeft: "22px",
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
            p: 0,
            ml: 0,
            mr: "auto"
          },
          backgroundColor: "white",
        },
        paddingLeft: "32px",
        paddingRight: 15,
      },
    },
    MuiFormLabel: {
      defaultProps: {
        sx:{
            color: "black"
        }
      },
    },
  },
});
