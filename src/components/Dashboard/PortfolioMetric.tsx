import React from "react";
import { Box, Typography, Stack } from "@mui/material";

interface PortfolioMetricProps {
  value: string;
  label: string;
  color: string;
}

const PortfolioMetric: React.FC<PortfolioMetricProps> = ({
  value,
  label,
  color,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 4,
          height: "56px",
          backgroundColor: color,
          borderRadius: "10px",
        }}
      />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {label}
        </Typography>
      </Box>
    </Stack>
  );
};

export default PortfolioMetric;
