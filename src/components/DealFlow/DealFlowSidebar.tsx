import React from "react";
import { Typography, Box, Button, Divider } from "@mui/material";

const DealFlowSidebar = () => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        backgroundColor: "#f4f5f7", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Investment Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            component="img"
            src="https://placehold.co/60x60"
            alt="The Edison"
            sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              The Edison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Milwaukee, WI
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ ml: "auto", fontWeight: "bold" }}>
            $0
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 'auto' }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Questions?
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            component="img"
            src="https://placehold.co/40x40"
            alt="Support"
            sx={{ width: 40, height: 40, mr: 2, borderRadius: "50%" }}
          />
          <Typography variant="body2" color="text.secondary">
            Give us a call or chat anytime - we'll answer any questions you have
          </Typography>
        </Box>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            mb: 1,
            textTransform: "uppercase",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
        >
          Chat
        </Button>
        <Typography variant="body2" align="center" color="text.secondary">
          (555) 555-5555
        </Typography>
      </Box>
    </Box>
  );
};

export default DealFlowSidebar;