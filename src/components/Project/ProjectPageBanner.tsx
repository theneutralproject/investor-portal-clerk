import { Box, Typography } from "@mui/material";

const ProjectPageBanner = ({ headline, description, background }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundImage: `url("${background}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          padding: 3,
          marginLeft: 2,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: headline === "Learn" ? "white" : "",
          }}
        >
          {headline}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: headline === "Learn" ? "rgba(255, 255, 255, 0.80)" : "",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectPageBanner;
