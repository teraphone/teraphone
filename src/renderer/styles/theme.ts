import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

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
      shadows: {
        header: string;
        footer: string;
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
      shadows?: {
        header?: string;
        footer?: string;
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

export const muiTheme = createTheme({
  typography: {
    fontFamily: [
      'InterVariable',
      'system-ui',
      '"Apple Color Emoji"',
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
    info: {
      main: '#5e5e5e',
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
        height: 41,
      },
    },
    shadows: {
      header: '0 0 3px 1px rgb(0 0 0 / 10%)',
      footer: '0 1px 3px 1px rgb(0 0 0 / 10%)',
    },
  },
  components: {
    // TODO: Decrease elevation without affecting :focus-visible style
    // MuiButton: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       boxShadow: theme.shadows[1],
    //       '&:focus-visible': {
    //         boxShadow: theme.shadows[3],
    //       },
    //       '&:hover': {
    //         boxShadow: theme.shadows[3],
    //       },
    //       '&:active': {
    //         boxShadow: theme.shadows[0],
    //       },
    //     }),
    //   },
    // },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme, className }) => {
          const sx = {
            '&:focus-visible': {
              boxShadow: `0px 0px 0px 0.2rem ${alpha(
                theme.palette.primary.main,
                0.2
              )}`,
            },
          };

          const color = buttonColorFromClassName(className as string);
          let containedSx = {};
          if (color) {
            containedSx = {
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

          return { ...sx, ...containedSx };
        },
      },
    },
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
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '32px',
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
  },
});

export default muiTheme;
