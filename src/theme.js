import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5C6BC0', // A slightly brighter indigo/blue
      light: '#8e99f3',
      dark: '#26418f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFB300', // A warm, golden amber for contrast
      light: '#ffe54c',
      dark: '#c68400',
      contrastText: '#fff',
    },
    error: {
      main: '#EF5350', // Standard Material-UI red for errors
    },
    warning: {
      main: '#FFC107', // Standard Material-UI amber for warnings
    },
    info: {
      main: '#29B6F6', // Standard Material-UI light blue for info
    },
    success: {
      main: '#66BB6A', // Standard Material-UI green for success
    },
    background: {
      default: '#E3F2FD', // Very light, pastel blue for the main app background
      paper: '#FFFFFF',   // Keep cards and other elevated surfaces white for crispness
    },
    text: {
      primary: '#212121', // Dark grey for primary text
      secondary: '#757575', // Medium grey for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.8rem', // Slightly larger
      fontWeight: 700,
      color: '#212121', // Ensure dark text on light backgrounds
    },
    h2: {
      fontSize: '2.2rem',
      fontWeight: 600,
      color: '#212121',
    },
    h3: {
      fontSize: '1.9rem',
      fontWeight: 600,
      color: '#212121',
    },
    h4: {
      fontSize: '1.6rem',
      fontWeight: 600,
      color: '#212121',
    },
    h5: {
      fontSize: '1.3rem',
      fontWeight: 600,
      color: '#212121',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#212121',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none', // Keep original casing for buttons
      fontWeight: 600, // Slightly bolder buttons
    },
  },
  shape: {
    borderRadius: 8, // Consistent border radius for most elements
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px', // Slightly more padding for buttons
          borderRadius: 8, // Apply theme's border radius
        },
        contained: {
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // More pronounced shadow for contained buttons
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0,0,0,0.15)', // Deeper shadow on hover
          },
        },
        outlined: {
          borderColor: 'rgba(0,0,0,0.12)', // Default outlined button border
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.2)',
            backgroundColor: 'rgba(0,0,0,0.04)', // Subtle background on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Slightly stronger default card shadow
          borderRadius: 16, // More rounded cards by default
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // All text fields outlined by default
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded corners for text input fields
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined', // All select fields outlined by default
      },
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for select fields
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // The gradient and specific shadows are handled in the Layout component's StyledAppBar
          // to allow for more dynamic styling specific to the AppBar itself.
          // Default elevation is set to 1 in the Layout component.
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Match the progress bar styling
          height: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded chips
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded alerts
        },
      },
    },
  },
});

export default theme;