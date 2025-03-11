import { useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { Avatar, Menu, MenuItem, IconButton, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import PolicyIcon from '@mui/icons-material/Policy';
import posthog from 'posthog-js';
import Link from 'next/link';
import { USER_AVATAR_TEST_ID } from 'e2e/testIds';

const UserAvatar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  const handleClick = (event: React.MouseEvent<EventTarget>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    posthog.reset();
    void signOut();
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (!user.firstName || !user.lastName) return 'U';
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', gap: 2 }} data-testid={USER_AVATAR_TEST_ID}>
        <Link
          href="/login"
          passHref
          data-testid={`${USER_AVATAR_TEST_ID}-sign-up`}
        >
          <Button
            variant="neutralYellow"
            data-testid={`${USER_AVATAR_TEST_ID}-sign-up-btn`}
          >
            Create account
          </Button>
        </Link>
        <Link
          href="/login"
          passHref
          data-testid={`${USER_AVATAR_TEST_ID}-sign-in`}
        >
          <Button
            variant="text"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: '#f5f5f5',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
            data-testid={`${USER_AVATAR_TEST_ID}-sign-in-btn`}
          >
            Sign in
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ bgcolor: '#bdbdbd' }}>{getInitials()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl as Element}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        data-testid={`${USER_AVATAR_TEST_ID}-menu`}
      >
        <Link href="/terms" passHref>
          <MenuItem
            onClick={handleClose}
            sx={{ width: '200px' }}
            data-testid={`${USER_AVATAR_TEST_ID}-menu-terms`}
          >
            <DescriptionIcon sx={{ marginRight: 1 }} /> Terms of Service
          </MenuItem>
        </Link>
        <Link href="/privacy" passHref>
          <MenuItem
            onClick={handleClose}
            sx={{ width: '200px' }}
            data-testid={`${USER_AVATAR_TEST_ID}-menu-privacy`}
          >
            <PolicyIcon sx={{ marginRight: 1 }} /> Privacy
          </MenuItem>
        </Link>
        <MenuItem
          onClick={handleSignOut}
          sx={{ width: '200px' }}
          data-testid={`${USER_AVATAR_TEST_ID}-menu-sign-out`}
        >
          <LogoutIcon sx={{ marginRight: 1 }} /> Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAvatar;
