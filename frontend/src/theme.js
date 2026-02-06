import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366'
    },
    secondary: {
      main: '#00AEEF'
    },
    background: {
      default: '#F5F8FA',
      paper: '#FFFFFF'
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: '"Sora", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: -0.5
    },
    h5: {
      fontWeight: 700
    },
    subtitle1: {
      fontWeight: 600
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(0, 51, 102, 0.08)',
          boxShadow: '0 24px 60px rgba(8, 24, 54, 0.12)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    }
  }
});

export default theme;
