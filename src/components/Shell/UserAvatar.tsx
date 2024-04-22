/* eslint-disable */
//@ts-nocheck
import { useClerk, useUser } from "@clerk/nextjs";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import React from "react";

import _ from "lodash";

function findPropertyRecursive(item: any, key: any) {
  if (_.has(item, key)) {
    return item[key];
  }

  let result = undefined;

  _.forEach(item, (value: any) => {
    if (_.isObject(value) || _.isArray(value)) {
      const found = findPropertyRecursive(value, key);
      if (found !== undefined) {
        result = found;
        return false; // This breaks the lodash forEach loop
      }
    }
  });

  return result;
}

const UserAvatar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  const email = findPropertyRecursive(user?.emailAddresses, "emailAddress");

  if (!user) {
    return <div>Loading...</div>;
  }

  const getInitials = () => {
    if (!user) return "U";
    if (!user.firstName || !user.lastName) return "U";
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  };

  if (isMobile) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "black" }}>
      <Avatar sx={{ bgcolor: "#506fd9" }}>{getInitials()}</Avatar>
      <Box>
        <Typography variant="h6" sx={{ fontSize: "16px" }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="h6" sx={{ fontSize: "16px" }}>
          {email}
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<LogoutIcon />}
        onClick={() => signOut(() => router.push("/sign-in"))}
      >
        Signout
      </Button>
    </Box>
  );
};

export default UserAvatar;
