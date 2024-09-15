import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6439FF', // Main color for primary
      dark: '#115293', // Darker shade of primary
    },
    secondary: {
      main: '#dc0000', // Main color for secondary
      dark: '#9a0036', // Darker shade of secondary
    },
  },
  // Add other theme customization here if needed
});

export default theme;