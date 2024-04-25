import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

const UserAvatar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  const handleClick = (event: React.MouseEvent<EventTarget>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    void signOut();
  };

  const getInitials = () => {
    if (!user) return "U";
    if (!user.firstName || !user.lastName) return "U";
    return user.firstName.charAt(0) + user.lastName.charAt(0);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar sx={{ bgcolor: "#8E6B63" }}>{getInitials()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl as Element}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSignOut} sx={{ width: "200px" }}>
          <LogoutIcon sx={{ marginRight: 1 }} /> Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAvatar;
