'use client';

import { CssBaseline } from '@mui/material';
import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Inter } from 'next/font/google';
import { Roboto } from 'next/font/google';

declare module '@mui/material/styles' {
  interface Palette {
    snowdayGray: Palette['primary'];
    snowdayText: Palette['primary'];
    neutralDarkGray: Palette['primary'];
    neutralMarble: Palette['primary'];
    neutralRustTerracotta: Palette['primary'];
  }
  interface PaletteOptions {
    snowdayGray: PaletteOptions['primary'];
    snowdayText: PaletteOptions['primary'];
    neutralDarkGray: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    snowdayBlue: true;
    neutralBlack: true;
    neutralYellow: true;
    grayCancel: true;
    grayPill: true;
    blackPill: true;
    neutralRustTerracotta: true;
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    bordered: true;
    green: true;
    marble: true;
    greenForest: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    bordered: true;
    green: true;
    marble: true;
    greenForest: true;
  }
}

const palette = {
  background: {
    default: '#FFFFFF',
  },
  primary: {
    main: '#556cd6',
  },
  secondary: {
    main: '#19857b',
  },
  error: {
    main: red.A400,
  },
  snowdayGray: {
    main: '#F8F9FA',
    dark: '#F8F9FA',
    light: '#f3f5f9',
  },
  neutralDarkGray: {
    main: '#1e2b30',
    dark: '#1e2b30',
    light: '#1e2b30',
  },
  snowdayText: {
    main: '#212830',
  },
  neutralMarble: {
    main: '#F9F6F1',
  },
  neutralRustTerracotta: {
    main: '#CB5C0D',
  },
};

export const inter = Inter({
  subsets: ['latin'],
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
});

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 1200,
      md: 1200,
      lg: 1200,
      xl: 1536,
    },
  },
  palette,
  typography: {
    allVariants: {
      fontFamily: inter.style.fontFamily,
    },
    h6: {
      color: `rgba(0, 0, 0, 0.87))`,
      fontFamily: roboto.style.fontFamily,
      fontSize: '20px',
      fontWeight: 500,
    },
    h3: {
      fontWeight: 400,
      color: `rgba(0, 0, 0, 0.87)`,
    },
    body2: {
      color: `rgba(0, 0, 0, 0.60)`,
      fontFamily: roboto.style.fontFamily,
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '143%',
      letterSpacing: '0.17px',
    },
    subtitle2: {
      color: '#000000DE',
      fontFamily: roboto.style.fontFamily,
      fontSize: '16px',
      fontWeight: 500,
    },
    caption: {
      color: `rgba(0, 0, 0, 0.60)`,
      fontFamily: roboto.style.fontFamily,
      fontSize: '12px',
      fontWeight: 400,
    },
  },
  components: {
    MuiGrid2: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'neutralBlack' },
          style: {
            color: '#fff',
            backgroundColor: '#1E2B31',
            '&:hover': {
              backgroundColor: '#6e7985',
            },
            '&:disabled': {
              color: '#fff',
              backgroundColor: '#1E2B31',
              opacity: 0.5,
            },
          },
        },
        {
          props: { variant: 'neutralYellow' },
          style: {
            borderRadius: '56px',
            background: '#dfaf43',
            padding: '8px 22px',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#E6BF69',
            },
            '&:disabled': {
              color: '#fff',
              backgroundColor: '#DFAF44',
              opacity: 0.5,
            },
          },
        },
        {
          props: { variant: 'grayCancel' },
          style: {
            color: '#666',
            backgroundColor: 'transparent',
            border: '1px solid #D1D5DB',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              border: '1px solid #D1D5DB',
            },
            '&:disabled': {
              color: '#666',
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              opacity: 0.5,
            },
          },
        },
        {
          props: { variant: 'grayPill' },
          style: {
            color: '#00000099',
            backgroundColor: 'transparent',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            fontSize: '13px',
            borderRadius: '24px',
            padding: '8px 22px',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              border: '1px solid #D1D5DB',
            },
            '&:disabled': {
              color: '#666',
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              opacity: 0.5,
            },
          },
        },
        {
          props: { variant: 'blackPill' },
          style: {
            color: '#fff',
            backgroundColor: '#000',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            fontSize: '13px',
            borderRadius: '24px',
            padding: '4px 14px',
            '&:hover': {
              backgroundColor: '#1E2B31',
              border: '1px solid #D1D5DB',
            },
            '&:disabled': {
              color: '#00000061',
              backgroundColor: '#0000001F',
              border: 'none !important',
            },
          },
        },
        {
          props: { variant: 'neutralRustTerracotta' },
          style: {
            borderRadius: '56px',
            background: '#CB5C0D',
            padding: '8px 22px',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#CB5C0D',
            },
            '&:disabled': {
              color: '#fff',
              backgroundColor: 'rgba(203, 92, 13, 0.7)',
              opacity: 0.5,
            },
          },
        },
      ],
    },
    MuiCard: {
      variants: [
        {
          props: { variant: 'bordered' },
          style: {
            border: '1px solid rgba(0, 0, 0, 0.12)',
          },
        },
        {
          props: { variant: 'green' },
          style: {
            backgroundColor: '#E4F1EC',
          },
        },
        {
          props: { variant: 'marble' },
          style: {
            backgroundColor: '#F9F6F1',
          },
        },
        {
          props: { variant: 'greenForest' },
          style: {
            backgroundColor: '#224437',
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: `none`,
          boxShadow: 'none',
        },
      },
    },
    // MuiCardContent: {
    //   styleOverrides: {
    //     root: {
    //       padding: 16, // default padding for large screens and above
    //       "@media (max-width: 1535px)": {
    //         padding: "16px", // padding for large screens up to 1535px
    //       },
    //       "@media (max-width: 120px)": {
    //         padding: "10px", // padding for medium screens down to 1199px
    //       },
    //       "@media (max-width: 600px)": {
    //         padding: "0px", // padding for small screens and below 1199px
    //       },
    //     },
    //   },
    // },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default function NeutralThemeProvider(props: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {props.children}
    </ThemeProvider>
  );
}
