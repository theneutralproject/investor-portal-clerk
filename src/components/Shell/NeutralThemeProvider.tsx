"use client";

import { CssBaseline } from "@mui/material";
import { red } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Inter } from "next/font/google";

declare module "@mui/material/styles" {
  interface Palette {
    snowdayGray: Palette["primary"];
    snowdayText: Palette["primary"];
    neutralDarkGray: Palette["primary"];
  }
  interface PaletteOptions {
    snowdayGray: PaletteOptions["primary"];
    snowdayText: PaletteOptions["primary"];
    neutralDarkGray: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    snowdayBlue: true;
  }
}

const palette = {
  primary: {
    main: "#556cd6",
  },
  secondary: {
    main: "#19857b",
  },
  error: {
    main: red.A400,
  },
  snowdayGray: {
    main: "#F8F9FA",
    dark: "#F8F9FA",
    light: "#f3f5f9",
  },
  neutralDarkGray: {
    main: "#1e2b30",
    dark: "#1e2b30",
    light: "#1e2b30",
  },
  snowdayText: {
    main: "#212830",
  },
};

export const inter = Inter({
  subsets: ["latin"],
});

export const theme = createTheme({
  palette,
  typography: {
    allVariants: {
      fontFamily: inter.style.fontFamily,
    },
    h6: {
      fontSize: "21px",
      letterSpacing: "-0.2px",
      color: "#212830",
      fontWeight: 500,
      lineHeight: "1.2",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "snowdayBlue" },
          style: {
            color: "#fff",
            backgroundColor: "#506fd9",
            "&:hover": {
              backgroundColor: "#6e7985",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          borderColor: "#e2e5ec",
          boxShadow:
            "0 1px 2px rgba(204,210,218,.07), 0 2px 4px rgba(204,210,218,.07), 0 4px 8px rgba(204,210,218,.07), 0 8px 16px rgba(204,210,218,.07), 0 16px 32px rgba(204,210,218,.07), 0 32px 64px rgba(204,210,218,.07)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "1px 0 1px rgba(33,40,48,.01), 4px 0 4px rgba(33,40,48,.01), 16px 0 16px rgba(33,40,48,.01)",
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
