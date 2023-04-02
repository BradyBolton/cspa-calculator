
// import local css
import "./index.css";

// local imports
import App from "./App";

// import libraries
import React, { FC, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode: mode,
    ...(mode === 'light'
      ? {
        // palette values for light mode
        primary: blue,
        divider: blue[200],
        text: {
          primary: grey[900],
          secondary: grey[900],
        },
        background: {
          default: '#f2f2f2'
        }
      }
      : {
        // palette values for dark mode
        primary: blue,
        divider: blue[700],
        background: {
          default: grey[900],
          paper: grey[900],
        },
        text: {
          primary: '#ffffff',
          secondary: '#ffffff',
        },
      }),
  },
  /*
  typography: {
    body1: {
      fontSize: '1.1rem',
    },
    body2: {
      fontSize: '1.1rem',
    },
  },
  */
});

const AppWrapper: FC = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // Update the theme only if the mode changes
  // @ts-ignore
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}


root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <AppWrapper />
    </LocalizationProvider>
  </React.StrictMode>
);