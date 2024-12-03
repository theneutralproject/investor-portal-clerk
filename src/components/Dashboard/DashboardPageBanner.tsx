import { Box, Typography } from "@mui/material";

const DashboardPageBanner = ({
  headline,
  background,
}: {
  headline: string;
  background: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        backgroundImage: `url("${background}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "220px",
        width: "100%",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          padding: 2,
          marginLeft: 2,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "white",
          }}
        >
          {headline}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPageBanner;
