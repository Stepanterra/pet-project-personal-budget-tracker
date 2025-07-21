import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(210, 100%, 50%)', // Financial blue
      light: 'hsl(210, 100%, 70%)',
      dark: 'hsl(210, 100%, 30%)',
    },
    secondary: {
      main: 'hsl(150, 60%, 45%)', // Green for income
      light: 'hsl(150, 60%, 65%)',
      dark: 'hsl(150, 60%, 25%)',
    },
    error: {
      main: 'hsl(0, 70%, 50%)', // Red for expenses
      light: 'hsl(0, 70%, 70%)',
      dark: 'hsl(0, 70%, 30%)',
    },
    background: {
      default: 'hsl(0, 0%, 98%)',
      paper: 'hsl(0, 0%, 100%)',
    },
    text: {
      primary: 'hsl(220, 15%, 15%)',
      secondary: 'hsl(220, 10%, 45%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});