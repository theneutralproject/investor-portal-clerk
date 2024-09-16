import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";
import posthog from "posthog-js";
import Link from "next/link";

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
    if (!user) return "U";
    if (!user.firstName || !user.lastName) return "U";
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ bgcolor: "#bdbdbd" }}>{getInitials()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl as Element}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link href="/terms" passHref>
          <MenuItem component="a" onClick={handleClose} sx={{ width: "200px" }}>
            <DescriptionIcon sx={{ marginRight: 1 }} /> Terms of Service
          </MenuItem>
        </Link>
        <MenuItem onClick={handleSignOut} sx={{ width: "200px" }}>
          <LogoutIcon sx={{ marginRight: 1 }} /> Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAvatar;