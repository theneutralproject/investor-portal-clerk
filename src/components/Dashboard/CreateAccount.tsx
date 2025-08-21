'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Link,
  Divider,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSignInLink = styled(Link)(({}) => ({
  color: 'black',
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: 'gray',
  },
}));

export const CreateAccountButton = ({ ...props }) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    // Only run on client-side after component mounts
    setPath(encodeURIComponent(window.location.pathname));
  }, []);

  return (
    <Button
      href={`https://accounts.neutral.us/sign-up?redirectUrl=${path}`}
      {...props}
      variant="neutralRustTerracotta"
    >
      CREATE ACCOUNT
    </Button>
  );
};

export const SignInButton = ({ ...props }) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    // Only run on client-side after component mounts
    setPath(encodeURIComponent(window.location.pathname));
  }, []);

  return (
    <StyledSignInLink
      href={`https://accounts.neutral.us/sign-in?redirectUrl=${path}`}
      {...props}
    >
      SIGN IN
    </StyledSignInLink>
  );
};

interface CreateAccountProps {
  onCreateAccount?: () => void;
  onSignIn?: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({}) => {
  return (
    <Card
      variant="greenForest"
      sx={{
        borderRadius: '8px',
        color: 'white',
        mb: 2,
      }}
    >
      <CardContent>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: '20px',
              mb: 2,
            }}
          >
            Create Your Account
          </Typography>

          <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.5)' }} />

          <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
            Create your free account to access exclusive investment information.
          </Typography>

          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <CreateAccountButton />
            <SignInButton
              sx={{
                color: 'white',
                '&:hover': {
                  color: 'gray',
                },
              }}
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateAccount;
