import { createTheme } from "@mui/material";

export const layoutTheme = createTheme({
  typography: {
    fontFamily: ["Source Sans Pro", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h5: {
      fontSize: 12,
      marginLeft: "16px",
      marginRight: "auto",
      marginTop: 0,
      color: "hsl(204, 12%, 45%)",
    },
    h6: {
      fontSize: 12,
      fontWeight: 600,
      marginTop: "22px",
      marginRight: "auto",
      marginLeft: "2%",
    },
    body1: {
      fontSize: 16,
      marginLeft: "16px",
      marginRight: "auto",
    },
  },

  components: {
    MuiInputLabel: {
      defaultProps: {
        sx: { color: "white", fontSize: 20, fontWeight: 400 },
      },
    },
    MuiAppBar: {
      defaultProps: {
        sx: {
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "80px",
          padding: "6px",
          backgroundColor: "hsl(216, 42%, 13%)",
          position: "static",
          boxShadow: "none",
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
          marginRight: "auto",
          marginLeft: "auto",
          color: "white",
        },
      },
    },
    MuiImageList: {
      defaultProps: {
        cols: 1,
      },
      variants: [
        {
          props: { className: "gw-logo-top" },
          style: {
            marginLeft: 0,
            marginRight: "auto",
            overflow: "hidden",
          },
        },
        {
          props: { className: "badge" },
          style: {
            marginRight: "2px",
            marginLeft: "auto",
            marginBottom: "15px",
            marginTop: "auto",
            overflow: "hidden",
          },
        },
      ],
    },
    MuiAvatar: {
      defaultProps: {
        style: {
          height: "25px",
          width: "25px",
          marginRight: "20px",
          marginTop: "10px",
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        sx: { ml: 1, flex: 1 },
      },
    },
    MuiGrid: {
      defaultProps: {
        container: true,
        maxWidth: "200px",
        marginRight: 0,
        marginLeft: "auto",
      },
    },
    MuiIconButton: {
      defaultProps: {
        sx: { padding: 0, margin: 0 },
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
        PaperProps: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            p: "20px",
          },
        },
        transformOrigin: { horizontal: "right", vertical: "top" },
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        sx: {
          "& .MuiLink-root": {
            color: "hsl(196, 100%, 31%)",
            fontSize: 14,
            fontWeight: 400,
            p: 0,
            m: 0,
          },
          m: 0,
        },
      },
    },
    MuiDivider: {
      defaultProps: {
        sx: {
          border: 1,
          m: 2,
          color: "hsl(214, 22%, 58%);",
        },
      },
    },
  },
});
