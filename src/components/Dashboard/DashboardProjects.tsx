import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  styled,
  Divider,
  LinearProgress,
} from "@mui/material";
import { type ProjectWithAllNestedData } from "@/libs/types";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: "none",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const ProjectImage = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const ProjectMetric = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
}));

interface DashboardProjectsProps {
  projects: ProjectWithAllNestedData[];
}

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects }) => {
  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
  };

  return (
    <Card sx={{ borderRadius: "8px", mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: "20px", mb: 2 }}>
          Offerings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {projects.map((project) => {
          const headerImage = project.pictures.find(
            (pic) => pic.type === "HEADER"
          )?.url;
          const fundingProgress =
            (project.investmentStats.investmentRaised /
              project.investmentStats.investmentGoal) *
            100;

          return (
            <StyledCard key={project.id} elevation={1}>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <ProjectImage>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headerImage ?? `/project-images/${project.id}.jpg`}
                      alt={project.name}
                    />
                  </ProjectImage>
                </Grid>

                <Grid item xs>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.location}
                      </Typography>
                    </Box>

                    <Button
                      variant="grayPill"
                      href={`/projects/${project.slug}`}
                    >
                      VIEW PROJECT
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", gap: 6, mb: 1 }}>
                    <ProjectMetric>
                      <Typography variant="h6">
                        {formatNumber(project.investmentStats.equityIRR)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        IRR
                      </Typography>
                    </ProjectMetric>

                    <ProjectMetric>
                      <Typography variant="h6">
                        {project.investmentStats.equityTermMonths}mo.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Term
                      </Typography>
                    </ProjectMetric>

                    <ProjectMetric>
                      <Typography variant="h6">
                        {formatNumber(
                          project.investmentStats.targetEquityMultiple
                        )}
                        x
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Equity Multiple
                      </Typography>
                    </ProjectMetric>

                    <ProjectMetric>
                      <Typography variant="h6">
                        {formatNumber(fundingProgress)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fund Tracker
                      </Typography>
                    </ProjectMetric>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={fundingProgress > 100 ? 100 : fundingProgress}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        backgroundColor: "#2f7d32",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </StyledCard>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DashboardProjects;
