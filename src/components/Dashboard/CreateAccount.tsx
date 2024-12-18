import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Link,
  Divider,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const CreateButton = styled(Button)(({}) => ({
  backgroundColor: "white",
  color: "black",
  borderRadius: "56px",
  textTransform: "none",
  padding: "10px 20px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const SignInLink = styled(Link)(({}) => ({
  color: "rgba(255, 255, 255, 0.66)",
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": {
    color: "rgba(255, 255, 255, 1)",
  },
}));

interface CreateAccountProps {
  onCreateAccount?: () => void;
  onSignIn?: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({}) => {
  return (
    <Card
      sx={{
        backgroundColor: "black",
        borderRadius: "8px",
        color: "white",
        mb: 2,
      }}
    >
      <CardContent>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: "20px",
              mb: 2,
            }}
          >
            Create Your Account
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "#3C3C3C" }} />

          <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
            Create your free account to access exclusive investment information.
          </Typography>

          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <CreateButton href="/login">CREATE ACCOUNT</CreateButton>

            <SignInLink href="/login">SIGN IN</SignInLink>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateAccount;
