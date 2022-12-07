import { createTheme } from "@mui/material";
import elysianBackgroundImage from "../images/background-elysian.svg";
import dobsonBackgroundImage from "../images/background-dobson.svg";
import cortinaBackgroundImage from "../images/background-cortina.svg";
import banffBackgroundImage from "../images/background-banff.svg";
import gradientBackground from "../images/background-gradient.svg";

export const landingPageTheme = createTheme({
  palette: {
    primary: {
      main: "#00739d",
    },
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
      marginTop: "5px",
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
          borderRadius: 1,
        },
      },
      variants: [
        { props: { className: "category-paper" }, style: { padding: "24px" } },
        {
          props: { className: "product-family-paper" },
          style: {
            height: "fit-content",
            textAlign: "center",
            marginBottom: 0,
            padding: "35px",
          },
        },
        {
          props: { className: "sidebar" },
          style: { padding: "24px", marginBottom: "auto" },
        },
      ],
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
    MuiGrid2: {
      defaultProps: {
        container: true,
        paddingLeft: "7%",
        xs: 12,
      },
      variants: [
        {
          props: { className: "elysian" },
          style: {
            backgroundImage: `url(${elysianBackgroundImage})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "bottom-right",
            backgroundSize: "cover",
            minHeight: "100vh",
            alignContent: "baseline",
          },
        },
        {
          props: { className: "dobson" },
          style: {
            backgroundImage: `url(${dobsonBackgroundImage})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "bottom-right",
            backgroundSize: "cover",
            minHeight: "100vh",
            alignContent: "baseline",
          },
        },
        {
          props: { className: "cortina" },
          style: {
            backgroundImage: `url(${cortinaBackgroundImage})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "bottom-right",
            backgroundSize: "cover",
            minHeight: "100vh",
            alignContent: "baseline",
          },
        },
        {
          props: { className: "banff" },
          style: {
            backgroundImage: [
              `url(${banffBackgroundImage})`,
              `url(${gradientBackground})`,
            ],
            backgroundAttachment: "fixed",
            backgroundPosition: "bottom-right",
            backgroundSize: "cover",
            minHeight: "100vh",
            alignContent: "baseline",
          },
        },
        {
          props: { className: "aspen" },
          style: {
            backgroundImage: `url(${gradientBackground})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "bottom-right",
            backgroundSize: "cover",
            minHeight: "100vh",
            alignContent: "baseline",
          },
        },
        {
          props: { className: "page-title" },
          style: {
            container: true,
            xs: 1,
            textAlign: "left",
            width: "100%",
            flexDirection: "column",
          },
        },
        {
          props: { className: "category-content" },
          style: {
            xs: 3,
            container: true,
            marginBottom: 10,
            maxWidth: "70%",
          },
        },
        {
          props: { className: "family-product-content" },
          style: {
            xs: 3,
            container: true,
            maxWidth: "70%",
            marginTop: "2%",
            marginBottom: "auto",
          },
        },
      ],
    },
    MuiContainer: {
      defaultProps: {
        sx: {
          height: 20,
          mb: 0,
          mt: "30px",
          ml: 0,
          mr: "auto",
          p: 0,
        },
      },
      variants: [
        {
          props: { className: "breadcrumbs" },
          style: {
            paddingLeft: 0,
          },
        },
      ],
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
    MuiMenu: {
      defaultProps: {
        style: { top: "-15px", left: "-1px" },
      },
    },
  },
});
