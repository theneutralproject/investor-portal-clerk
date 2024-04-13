"use client";

import CopyrightIcon from "@mui/icons-material/Copyright";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpIcon from "@mui/icons-material/Help";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { theme } from "./NeutralThemeProvider";

export const ROUTES = [
  {
    name: "Projects",
    path: "/projects",
    icon: HomeIcon,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: MessageIcon,
  },
];

const getPageTitle = (pathName: string) => {
  const route = ROUTES.find((perRoute) => pathName.includes(perRoute.path));
  return route ? route.name : "Neutral Project";
};

const drawerWidth = 240;
const mobileDrawerWidth = 56;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("md")]: {
        width: theme.spacing(9),
      },
    }),
  },
  [theme.breakpoints.down("md")]: {
    "& .MuiDrawer-paper": {
      width: mobileDrawerWidth,
    },
  },
}));

export default function Sidebar(props: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();

  const isActiveRoute = (routePath) => {
    return pathName.includes(routePath);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute" open sx={{ backgroundColor: "white" }}>
        <Toolbar
          sx={{
            pr: "24px",
            border: "none !important",
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {getPageTitle(pathName)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.neutralDarkGray.main,
            border: "none !important",
            width: { sm: `${mobileDrawerWidth}px`, md: `${drawerWidth}px` },
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none !important",
          }}
        >
          <Image width="210" height="65" src="/logo.png" />
        </Toolbar>

        <List component="nav">
          {ROUTES.map((route) => (
            <ListItemButton
              key={route.name}
              onClick={() => {
                router.push(route.path);
              }}
              sx={{
                backgroundColor: isActiveRoute(route.path)
                  ? "#334044"
                  : theme.palette.neutralDarkGray.main,
                [theme.breakpoints.down("md")]: {
                  "& .MuiListItemText-primary": {
                    display: "none",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: "auto", // Adjust icon spacing
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActiveRoute(route.path) ? "white" : "#e2e4e4",
                  minWidth: "40px",
                }}
              >
                <route.icon />
              </ListItemIcon>
              <ListItemText
                primary={route.name}
                sx={{
                  color: isActiveRoute(route.path) ? "white" : "#e2e4e4",
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <List
          sx={{
            marginTop: "auto",
          }}
        >
          <ListItemButton
            key="support"
            onClick={() => {
              router.push("/support");
            }}
          >
            <ListItemIcon
              sx={{
                color: "#e2e4e4",
                minWidth: "40px",
              }}
            >
              <HelpIcon />
            </ListItemIcon>
            <ListItemText
              primary="Support"
              sx={{
                color: "#e2e4e4",
              }}
            />
          </ListItemButton>
          <ListItemButton
            key="copyright"
            onClick={() => {
              router.push("/terms");
            }}
          >
            <ListItemIcon
              sx={{
                color: "#e2e4e4",
                minWidth: "40px",
              }}
            >
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText
              primary="Terms of Service"
              sx={{
                color: "#e2e4e4",
              }}
            />
          </ListItemButton>
          <ListItemButton key="copyright">
            <ListItemIcon
              sx={{
                color: "#e2e4e4",
                minWidth: "40px",
              }}
            >
              <CopyrightIcon />
            </ListItemIcon>
            <ListItemText
              primary="2024 Neutral Project"
              sx={{
                color: "#e2e4e4",
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: "#fbfcfe",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {props.children}
        </Container>
      </Box>
    </Box>
  );
}
