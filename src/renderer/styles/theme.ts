import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

// See https://mui.com/material-ui/customization/theming/#custom-variables
// Module augmentation is required to add custom variables to the theme
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      palette: {
        background: {
          secondary: string;
        };
      };
      spacing: {
        header: {
          height: number;
        };
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      palette?: {
        background?: {
          secondary: string;
        };
      };
      spacing?: {
        header?: {
          height?: number;
        };
      };
    };
  }
}

function buttonColorFromClassName(className: string) {
  const colorVariants = [
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ];
  const buttonVariants = className
    .split(' ')
    .filter((c) => c.startsWith('MuiButton-contained'))
    .map((c) => c.replace('MuiButton-contained', '').toLowerCase());
  const color = colorVariants.find((c) => buttonVariants.includes(c)) as
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';

  return color;
}

export const globalStyles = {
  'html, body, body > div': {
    height: '100%',
  },
};

export const muiTheme = createTheme({
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'system-ui',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      'sans-serif',
    ].join(','),
    // 16px browser default base font size
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 'bold',
    },
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 'bold',
    },
    h6: {
      fontSize: '0.75rem', // 12px
      fontWeight: 'bold',
    },
    button: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#07C',
    },
    secondary: {
      main: '#A4C',
    },
    text: {
      primary: '#222',
    },
  },
  custom: {
    palette: {
      background: {
        secondary: grey[100],
      },
    },
    spacing: {
      header: {
        height: 48,
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: '0.875rem', // 14px
          lineHeight: 1.4286,
          backgroundImage: 'radial-gradient(#fafafa 40%, transparent 43%)',
          backgroundSize: '24px 24px',
          height: '100%',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '32px',
          paddingRight: '32px',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme, className }) => {
          const color = buttonColorFromClassName(className as string);

          if (color) {
            return {
              '&.MuiButton-contained:hover': {
                backgroundColor: theme.palette[color].light,
              },
              '&.MuiButton-contained:focus-visible': {
                backgroundColor: theme.palette[color].light,
              },
              '&.MuiButton-contained:active': {
                backgroundColor: theme.palette[color].main,
              },
            };
          }

          return {};
        },
      },
    },
  },
});

export default muiTheme;
