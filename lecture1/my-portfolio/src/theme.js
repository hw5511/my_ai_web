import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C41E3A',
      light: '#E8828C',
      dark: '#9E1830',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9B7BB8',
      light: '#C9A8E0',
      dark: '#7B5BA8',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDF5F3',
      paper: '#FFF8F6',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#4A4A4A',
    },
    error: {
      main: '#E63946',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#9B7BB8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2D2D2D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2D2D2D',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2D2D2D',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2D2D2D',
    },
    body1: {
      fontSize: '1rem',
      color: '#4A4A4A',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6B6B6B',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#9E1830',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#7B5BA8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(196, 30, 58, 0.1)',
        },
      },
    },
  },
  spacing: 8,
});

export default theme;
