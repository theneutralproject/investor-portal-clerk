import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import DealFlowLearnMoreModal, {
  type ModalKeyType,
} from "./Modal/DealFlowLearnMoreModal";

interface DealFlowTitleProps {
  title: string;
  modalKey?: ModalKeyType;
}

const DealFlowTitle: React.FC<DealFlowTitleProps> = ({ title, modalKey }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#000000DE" }}>
          {title}
        </Typography>
        {modalKey && <DealFlowLearnMoreModal modalKey={modalKey} />}
      </Box>
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
