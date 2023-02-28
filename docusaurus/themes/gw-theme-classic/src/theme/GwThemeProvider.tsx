import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { guidewireThemeOptions } from './GwThemeOptions';
import '@fontsource/source-sans-pro';

type GwThemeProviderProps = {
  children: React.ReactNode;
};

export default function GwThemeProvider({ children }: GwThemeProviderProps) {
  const theme = createTheme(guidewireThemeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
