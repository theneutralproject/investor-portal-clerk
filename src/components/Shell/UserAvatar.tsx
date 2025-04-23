import { useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { Avatar, Menu, MenuItem, IconButton, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import posthog from 'posthog-js';
import Link from 'next/link';
import {
  CreateAccountButton,
  SignInButton,
} from '@/components/Dashboard/CreateAccount';
import { USER_AVATAR_TEST_ID } from 'e2e/testIds';

interface IUserAvatarProps {
  isAdvisor?: boolean;
}

const UserAvatar = ({ isAdvisor }: IUserAvatarProps) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const basePath = isAdvisor ? '/advisor' : '';

  const handleClick = (event: React.MouseEvent<EventTarget>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    posthog.reset();
    window.hsConversationsSettings = {};
    void signOut();
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (!user.firstName || !user.lastName) return 'U';
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  };

  if (!user) {
    return (
      <Box
        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
        data-testid={USER_AVATAR_TEST_ID}
      >
        <div data-testid={`${USER_AVATAR_TEST_ID}-sign-up`}>
          <CreateAccountButton
            variant="neutralYellow"
            data-testid={`${USER_AVATAR_TEST_ID}-sign-up-btn`}
          >
            Create account
          </CreateAccountButton>
        </div>
        <div data-testid={`${USER_AVATAR_TEST_ID}-sign-in`}>
          <SignInButton
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
          </SignInButton>
        </div>
      </Box>
    );
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-testid={`${USER_AVATAR_TEST_ID}-user-avatar`}
      >
        <Avatar sx={{ bgcolor: '#bdbdbd' }}>{getInitials()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl as Element}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        data-testid={`${USER_AVATAR_TEST_ID}-menu`}
      >
        <Link href={`${basePath}/account`} passHref>
          <MenuItem
            onClick={handleClose}
            sx={{ width: '200px' }}
            data-testid={`${USER_AVATAR_TEST_ID}-menu-account`}
          >
            <PersonIcon sx={{ marginRight: 1 }} /> My Account
          </MenuItem>
        </Link>
        <Link href={`${basePath}/terms`} passHref>
          <MenuItem
            onClick={handleClose}
            sx={{ width: '200px' }}
            data-testid={`${USER_AVATAR_TEST_ID}-menu-terms`}
          >
            <DescriptionIcon sx={{ marginRight: 1 }} /> Terms of Service
          </MenuItem>
        </Link>
        <Link href={`${basePath}/privacy`} passHref>
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
