/* eslint-disable */
//@ts-nocheck
import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItemText,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { ListItem, ROUTES, buttonItems } from "./Sidebar";
import { useRouter, usePathname } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import { useClerk } from "@clerk/nextjs";
import posthog from "posthog-js";

const MobileSidebar = (props) => {
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const appBarHeight = 56;

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const router = useRouter();
  const pathName = usePathname();

  const isActiveRoute = (routePath: string) => {
    return pathName.includes(routePath);
  };
  const handleClick = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleSignOut = () => {
    posthog.reset();
    void signOut();
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: theme.palette.neutralDarkGray.main }}
      >
        <Toolbar
          sx={{
            pr: "24px",
            boxShadow: `0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)`,
            border: "none !important",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
          >
            <Image
              width="210"
              height="50"
              src="/NeutralWhiteLogo.svg"
              alt={""}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="top"
        open={isOpen}
        onClose={handleClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            top: `${appBarHeight}px`,
            backgroundColor: theme.palette.neutralDarkGray.main,
          },
        }}
      >
        <List component="nav">
          {ROUTES.map((route) => (
            <ListItemButton
              key={route.name}
              onClick={() => {
                handleClick(route.path);
              }}
              sx={{
                backgroundColor: isActiveRoute(route.path)
                  ? "#334044"
                  : theme.palette.neutralDarkGray.main,
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
        <List sx={{ marginTop: "auto" }}>
          {buttonItems.map((item) => (
            <ListItem key={item.key} item={item} />
          ))}

          <ListItem
            key={"signout"}
            item={{
              key: "signout",
              label: "Sign Out",
              icon: <LogoutIcon />,
              path: "/signout",
              onClick: () => handleSignOut(),
            }}
          />
        </List>
      </Drawer>
      <Toolbar />
      {/* This Toolbar is used to ensure content is not hidden under the AppBar */}
      {props.children}
    </div>
  );
};

export default MobileSidebar;
