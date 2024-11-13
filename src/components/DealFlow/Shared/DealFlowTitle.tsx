import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface DealFlowTitleProps {
  title: string;
}

const DealFlowTitle: React.FC<DealFlowTitleProps> = ({ title }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 500, color: "#000000DE", mt: 2 }}
      >
        {title}
      </Typography>
      <Divider
        sx={{
          borderColor: "rgba(0, 0, 0, 0.12)",
          my: 2,
          mb: 4,
        }}
      />
    </Box>
  );
};

export default DealFlowTitle;
