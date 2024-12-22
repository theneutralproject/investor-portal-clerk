'use client';

/* eslint-disable */
//@ts-nocheck

import CopyrightIcon from '@mui/icons-material/Copyright';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpIcon from '@mui/icons-material/Help';
import {
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { theme } from './NeutralThemeProvider';
import UserAvatar from './UserAvatar';
import MobileSidebar from './MobileSidebar';

export const ROUTES = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Learn',
    path: '/learn',
    icon: InfoIcon,
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: MessageIcon,
  },
];

export const buttonItems = [
  {
    key: 'terms',
    label: 'Terms of Service',
    icon: <DescriptionIcon />,
    path: '/terms',
  },
  {
    key: 'copyright',
    label: '2024 Neutral Project',
    icon: <CopyrightIcon />,
  },
];

export const ListItem = ({ item }: { item: any }) => (
  <ListItemButton key={item.key} onClick={item.onClick}>
    <ListItemIcon sx={{ color: '#e2e4e4', minWidth: '40px' }}>
      {item.icon}
    </ListItemIcon>
    <ListItemText primary={item.label} sx={{ color: '#e2e4e4' }} />
  </ListItemButton>
);

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const capitalize = (s: string) => s && s[0]?.toUpperCase() + s.slice(1);

export default function Sidebar(props: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();
  const isDealflowRoute = pathName.startsWith('/dealflow');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isActiveRoute = (routePath: string) => {
    return pathName.includes(routePath);
  };

  if (isMobile) {
    return <MobileSidebar>{props.children}</MobileSidebar>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            boxShadow: `0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)`,
            border: 'none !important',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            },
            backgroundColor: 'black',
          }}
        >
          <Image
            width="94"
            height="21"
            src="/Neutral_White_Medium.png"
            alt="Neutral Logo"
            onClick={() => router.push('/dashboard')}
            style={{ cursor: 'pointer' }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', ml: '50px' }}>
            {ROUTES.map(route => {
              //Logic to display based on logged in state (TODO when dashboard finalized)
              return (
                <Button
                  key={route.name}
                  onClick={() => router.push(route.path)}
                  sx={{
                    borderRadius: '15px',
                    padding: '5px 10px',

                    color: isActiveRoute(route.path)
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.66)',
                    backgroundColor: isActiveRoute(route.path)
                      ? 'rgba(255,255,255,0.2)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isActiveRoute(route.path)
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(255,255,255,0.1)',
                    },
                    fontSize: '14px',
                    mr: '10px',
                    textTransform: 'capitalize',
                  }}
                >
                  {route.name.charAt(0).toUpperCase() +
                    route.name.slice(1).toLowerCase()}
                </Button>
              );
            })}
          </Box>

          <Box
            sx={{
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserAvatar />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        {isDealflowRoute ? (
          <Box sx={{ height: 'calc(100vh - 64px)', backgroundColor: 'white' }}>
            {props.children}
          </Box>
        ) : (
          <Container
            maxWidth="xl"
            sx={{
              mt: 4,
              mb: 4,
            }}
          >
            {props.children}
          </Container>
        )}
      </Box>
    </Box>
  );
}
