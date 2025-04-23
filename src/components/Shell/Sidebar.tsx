'use client';

//@ts-nocheck

import CopyrightIcon from '@mui/icons-material/Copyright';
import DescriptionIcon from '@mui/icons-material/Description';
import PolicyIcon from '@mui/icons-material/Policy';
import {
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  useMediaQuery,
} from '@mui/material';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { theme } from './NeutralThemeProvider';
import UserAvatar from './UserAvatar';
import MobileSidebar from './MobileSidebar';
import { SIDEBAR_TEST_ID } from 'e2e/testIds';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export const buttonItems = [
  {
    key: 'terms',
    label: 'Terms of Service',
    dataTestId: `${SIDEBAR_TEST_ID}-terms`,
    icon: <DescriptionIcon />,
    path: '/terms',
  },
  {
    key: 'privacy',
    label: 'Privacy Policy',
    dataTestId: `${SIDEBAR_TEST_ID}-privacy`,
    icon: <PolicyIcon />,
    path: '/privacy',
  },
  {
    key: 'copyright',
    label: '2025 Neutral',
    dataTestId: `${SIDEBAR_TEST_ID}-copyright`,
    icon: <CopyrightIcon />,
  },
];

export const ListItem = ({
  item,
  dataTestId,
}: {
  item: any;
  dataTestId?: string;
}) => (
  <ListItemButton
    key={item.key}
    onClick={item.onClick}
    data-testid={dataTestId}
  >
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

interface ISidebarProps {
  children: React.ReactNode;
  isAdvisor?: boolean;
  routes: {
    name: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
      muiName: string;
    };
    dataTestId?: string;
  }[];
}

export default function Sidebar(props: ISidebarProps) {
  const router = useRouter();
  const pathName = usePathname();
  const isDealflowRoute = pathName.startsWith('/dealflow');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isActiveRoute = (routePath: string) => {
    const routeRoot = routePath.split('/')[1];
    const currentRoot = pathName.split('/')[1];

    return (
      pathName === routePath ||
      pathName.startsWith(`${routePath}/`) ||
      (routeRoot && currentRoot === routeRoot && pathName.startsWith(routePath))
    );
  };

  if (isMobile) {
    return (
      <MobileSidebar routes={props.routes}>{props.children}</MobileSidebar>
    );
  }

  return (
    <Box sx={{ display: 'flex' }} data-testid={SIDEBAR_TEST_ID}>
      <AppBar position="absolute">
        <Toolbar
          sx={{
            boxShadow: props.isAdvisor
              ? `0px 2px 4px -1px #00000033;`
              : `0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)`,
            border: 'none !important',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            },
            backgroundColor: props.isAdvisor ? '#FFFFFF' : 'black',
          }}
        >
          <Image
            width="94"
            height="21"
            src="/Neutral_White_Medium.png"
            alt="Neutral Logo"
            onClick={() => router.push('/dashboard')}
            style={{
              cursor: 'pointer',
              background: props.isAdvisor
                ? 'rgba(105, 156, 219, 1)'
                : 'transparent',
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', ml: '50px' }}>
            {props.routes.map(route => {
              //Logic to display based on logged in state (TODO when dashboard finalized)
              return (
                <Button
                  key={route.name}
                  onClick={() => router.push(route.path)}
                  data-testid={route.dataTestId}
                  sx={{
                    borderRadius: '15px',
                    padding: '5px 10px',

                    color: props.isAdvisor
                      ? isActiveRoute(route.path)
                        ? 'rgba(0, 0, 0, 0.87)'
                        : 'rgba(0, 0, 0, 0.6)'
                      : isActiveRoute(route.path)
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.66)',
                    backgroundColor: props.isAdvisor
                      ? isActiveRoute(route.path)
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'transparent'
                      : isActiveRoute(route.path)
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: props.isAdvisor
                        ? 'rgba(0, 0, 0, 0.08)'
                        : isActiveRoute(route.path)
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)',
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
            <UserAvatar isAdvisor={props.isAdvisor} />
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
