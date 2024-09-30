import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Main color for primary
      // main: '#6439FF', // Main color for primary
      dark: '#115293', // Darker shade of primary
    },
    secondary: {
      main: '#dc0000', // Main color for secondary
      dark: '#9a0036', // Darker shade of secondary
    },
  },
  // Add other theme customization here if needed
  breakpoints: { values: { sm: 700, md: 1380 } },
});

export default theme;