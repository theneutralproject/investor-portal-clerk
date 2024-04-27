import React from "react";
import { CardContent, Grid, Typography } from "@mui/material";
import { type Project } from "@prisma/client";

const ProjectMetrics: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <CardContent>
      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {project.projectIrr.toString()}%
          </Typography>
          <Typography variant="body2">IRR</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            60mo.
          </Typography>
          <Typography variant="body2">Term</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            value
          </Typography>
          <Typography variant="body2">label</Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectMetrics;
