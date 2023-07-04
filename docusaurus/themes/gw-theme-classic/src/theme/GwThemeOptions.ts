import { ThemeOptions } from '@mui/material';

export const guidewireThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#00739d',
    },
    secondary: {
      main: '#3c4c5e',
    },
    warning: {
      main: '#FFA500',
    },
  },
  typography: {
    fontFamily: ['Source Sans Pro', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
      '&:hover': {
        color: 'white',
      },
    },
  },
};
