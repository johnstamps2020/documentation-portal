import { createTheme } from "@mui/material";

export const layoutTheme = createTheme({
  typography: {
    fontFamily: ["Source Sans Pro", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h6: {
      fontSize: 11,
      fontWeight: 600,
      marginTop: "22px",
    },
  },

  components: {
    MuiAppBar: {
      defaultProps: {
        sx: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "80px",
          padding: "6px",
          backgroundColor: "hsl(216, 42%, 13%)",
        },
      },
    },
    MuiBottomNavigation: {
      defaultProps: {
        sx: {
          backgroundColor: "hsl(216, 42%, 13%)",
          color: "hsl(0, 0%, 98%)",
          display: "flex",
          alignItems: "left",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
        sx: {
          fontSize: 11,
          fontWeight: 600,
          marginTop: "22px",
          marginRight: "33%",
          color: "white",
        },
      },
    },
    MuiImageList: {
      defaultProps: {
        cols: 1,
        style: { marginRight: "2px", marginLeft: "auto" },
      },
    },
  },
});
