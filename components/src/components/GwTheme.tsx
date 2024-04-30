import '@fontsource/source-sans-pro';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

declare module '@mui/material/styles' {
  interface Palette {
    paleBackground: Palette['primary'];
    darkBlue: Palette['primary'];
  }

  interface PaletteOptions {
    paleBackground: PaletteOptions['primary'];
    darkBlue: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

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
    paleBackground: {
      main: '#e1e6eC',
      contrastText: '#131e2e',
    },
    darkBlue: {
      main: '#385583',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif'].join(
      ','
    ),
    h1: {
      fontSize: 40,
      textAlign: 'left',
      fontWeight: 600,
      marginRight: 'auto',
      marginTop: '5px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.375rem',
      textAlign: 'left',
      paddingBottom: '10px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.125rem',
      padding: '0.5rem 0',
    },
    h4: {
      fontSize: '1.1rem',
    },
    h5: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
        sx: {
          display: 'inline-block',
          color: 'hsl(196, 100%, 31%)',
          width: 'fit-content',
        },
      },
    },
  },
});

type GwThemeProviderProps = {
  children: React.ReactNode;
};

export function GwThemeProvider({ children }: GwThemeProviderProps) {
  const theme = createTheme(appTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
