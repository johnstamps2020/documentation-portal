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
          textAlign: "center",
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
          marginRight: "auto",
          marginLeft: "auto",
          color: "white",
        },
      },
    },
    MuiImageList: {
      defaultProps: {
        cols: 1,
        style: { marginRight: "2px", marginLeft: "auto", overflow: "hidden" },
      },
    },
    MuiAvatar: {
      defaultProps: {
        style: {
          height: "25px",
          width: "25px",
          marginRight: "20px",
          marginLeft: "auto",
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
        sx: { padding: 0 },
      },
    },
    MuiMenu: {
      defaultProps: {
        PaperProps: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
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
            color: "black",
            fontSize: 14,
            fontWeight: 400,
            p: 0,
            m: 0
          },
        },
      },
    },
  },
});
