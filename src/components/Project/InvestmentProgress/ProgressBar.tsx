import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

function ProgressBar({ dealStage }) {
  const value = ((dealStage + 1) / 4) * 100;

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            borderRadius: "4px",
            height: "18px",
            backgroundColor: "#c0c5ba",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#626F52",
            },
          }}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="text.secondary">{`${
          dealStage + 1
        } / 4`}</Typography>
      </Box>
    </Box>
  );
}

export default ProgressBar;
