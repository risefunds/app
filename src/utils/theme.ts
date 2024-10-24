import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
const defaultTheme = createTheme({});

// Create a theme instance.
const theme = createTheme({
  shape: {
    borderRadius: 0,
  },
  palette: {
    primary: {
      main: '#131f5b',
      contrastText: '#f1f1f1',
    },
    secondary: {
      main: '#fff',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f1f1f1',
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#000',
    },
  },
  typography: {
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        gutters: {
          paddingLeft: defaultTheme.spacing(3),
          paddingRight: defaultTheme.spacing(3),
        },
        root: {
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            borderLeft: `${defaultTheme.spacing(0.5)} solid #000`,
            paddingLeft: defaultTheme.spacing(2.5),
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #a9a9a9',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
