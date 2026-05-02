import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#255c99' },
    secondary: { main: '#2f7d62' },
    background: { default: '#f6f8fb', paper: '#ffffff' },
    text: { primary: '#17212f', secondary: '#607084' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: 0 },
    h6: { fontWeight: 750, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})
