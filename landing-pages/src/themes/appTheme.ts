import { createTheme } from '@mui/material';
import '@fontsource/source-sans-pro';

export const appTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 720,
      md: 950,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#00739d',
    },
    secondary: {
      main: '#3c4c5e',
    },
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif'].join(
      ','
    ),
    h1: {
      fontSize: 40,
      textAlign: 'left',
      color: 'white',
      fontWeight: 600,
      marginRight: 'auto',
      marginTop: '5px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.375rem',
      color: 'hsl(216, 42%, 13%)',
      textAlign: 'left',
      paddingBottom: '10px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.125rem',
      padding: '0.5rem 0',
      color: 'black',
    },
    h4: {
      fontSize: '0.2rem',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
        sx: {
          color: 'hsl(196, 100%, 31%)',
          width: 'fit-content',
        },
      },
    },
  },
});
