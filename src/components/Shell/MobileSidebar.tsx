/* eslint-disable */
//@ts-nocheck
import React, { useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { ListItem, ROUTES, buttonItems } from './Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useClerk } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { MOBILE_SIDEBAR_TEST_ID } from 'e2e/testIds';

const MobileSidebar = props => {
  const { signOut, user } = useClerk();
  const loggedIn = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appBarHeight = 41;

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

  const authItems = loggedIn
    ? [
        {
          key: 'signout',
          label: 'Sign Out',
          icon: <LogoutIcon />,
          path: '/signout',
          dataTestId: `${MOBILE_SIDEBAR_TEST_ID}-sign-out`,
          onClick: () => handleSignOut(),
        },
      ]
    : [
        {
          key: 'login',
          label: 'Log In',
          icon: <LoginIcon />,
          path: '/login',
          dataTestId: `${MOBILE_SIDEBAR_TEST_ID}-sign-in`,
          onClick: () => handleClick('/login'),
        },
        {
          key: 'create-account',
          label: 'Create Account',
          icon: <PersonAddIcon />,
          path: '/login',
          dataTestId: `${MOBILE_SIDEBAR_TEST_ID}-sign-up`,
          onClick: () => handleClick('/login'),
        },
      ];

  if (!isMobile) {
    return null;
  }

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: theme.palette.neutralDarkGray.main }}
        data-testid={MOBILE_SIDEBAR_TEST_ID}
      >
        <Toolbar
          sx={{
            boxShadow: `0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)`,
            border: 'none !important',
            backgroundColor: 'black',
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
            style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Image
              width="90"
              height="21"
              src="/Neutral_White_Medium.png"
              alt={''}
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
          '& .MuiDrawer-paper': {
            top: `${appBarHeight}px`,
            backgroundColor: 'black',
          },
        }}
      >
        <List component="nav">
          {ROUTES.map(route => (
            <ListItemButton
              key={route.name}
              onClick={() => {
                handleClick(route.path);
              }}
              sx={{
                backgroundColor: isActiveRoute(route.path) ? 'gray' : 'black',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActiveRoute(route.path) ? 'white' : '#e2e4e4',
                  minWidth: '40px',
                }}
              >
                <route.icon />
              </ListItemIcon>
              <ListItemText
                primary={route.name}
                sx={{
                  color: isActiveRoute(route.path) ? 'white' : '#e2e4e4',
                }}
              />
            </ListItemButton>
          ))}
        </List>
        <List sx={{ marginTop: 'auto' }}>
          {buttonItems.map(item => (
            <ListItem key={item.key} item={item} />
          ))}

          {authItems.map(item => (
            <ListItem key={item.key} item={item} data-tesid={item.dataTestId} />
          ))}
        </List>
      </Drawer>
      <Toolbar />
      {/* This Toolbar is used to ensure content is not hidden under the AppBar */}
      {props.children}
    </div>
  );
};

export default MobileSidebar;
