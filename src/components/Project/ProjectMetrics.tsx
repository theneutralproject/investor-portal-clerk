import React from 'react';
import { CardContent, Grid, Typography } from '@mui/material';
import type { ProjectWithAllNestedData, ProjectWithStats } from '@/libs/types';
import { displayEquityIRR } from '../Dashboard/DashboardProjects';

const ProjectMetrics: React.FC<{ project: ProjectWithStats }> = ({
  project,
}) => {
  return (
    <CardContent>
      <Grid container spacing={2} sx={{ textAlign: 'center' }}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {displayEquityIRR(project as ProjectWithAllNestedData)}
          </Typography>
          <Typography variant="body2">
            {project.id === 2 ? 'Interest Rate' : 'IRR'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {project.investmentStats.equityTermMonths}mo.
          </Typography>
          <Typography variant="body2">Term</Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectMetrics;
