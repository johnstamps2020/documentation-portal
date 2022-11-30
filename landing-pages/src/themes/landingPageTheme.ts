import { createTheme } from "@mui/material";
import elysianBackgroundImage from "../images/background-elysian.svg";

export const landingPageTheme = createTheme({
  palette: {
    primary: {
      main: "#00739d"
    }
  },
  typography: {
    fontFamily: ["Source Sans Pro", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    h1: {
      fontSize: 40,
      textAlign: "left",
      color: "white",
      fontWeight: 600,
      marginRight: "auto",
      marginTop: "30px",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.375rem",
      color: "hsl(216, 42%, 13%)",
      textAlign: "left",
      paddingBottom: "10px",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.125rem",
      padding: "0.5rem 0",
      color: "black",
    },
    h4: {
      fontSize: "0.2rem",
    },
  },

  components: {
    MuiStack: {
      defaultProps: {
        spacing: 1,
        color: "green",
        textAlign: "left",
      },
    },
    MuiPaper: {
      defaultProps: {
        sx: {
          marginRight: 2,
          marginTop: 2,
          width: 300,
          borderRadius: 2,
          padding: "24px",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        style: {
          textDecoration: "none",
          paddingBottom: "10px",
          color: "hsl(196, 100%, 31%)",
        },
      },
    },
    MuiGrid: {
      defaultProps: {
        container: true,
        paddingLeft: "10%",
        paddingRight: "5%",
        sx: {
          backgroundImage: `url(${elysianBackgroundImage})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "bottom-right",
          backgroundSize: "cover",
        },
        xs: 12,
      },
    },
    MuiContainer: {
      defaultProps: {
        sx: {
          height: 20,
        },
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
        sx: { color: "white", fontSize: 20, fontWeight: 600 },
      },
    },
  },
});
