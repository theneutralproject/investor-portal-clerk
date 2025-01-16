import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  styled,
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { type ProjectWithAllNestedData } from '@/libs/types';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: 'none',
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const ProjectImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 240,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: 120,
    height: 120,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const ProjectMetric = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
}));

const StatusBadge = ({
  status,
}: {
  status: 'ACTIVE' | 'UPCOMING' | 'INACTIVE';
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          text: 'Open for investment',
          sx: {
            borderRadius: '100px',
            background: 'var(--green-50, #E8F5E9)',
            color: 'var(--green-900, #1B5E20)',
          },
        };
      case 'UPCOMING':
        return {
          text: 'Coming soon',
          sx: {
            borderRadius: '100px',
            background: '#FFF8E1',
            color: '#F57F17',
          },
        };
      case 'INACTIVE':
        return {
          text: 'Closed for investment',
          sx: {
            borderRadius: '100px',
            background: 'var(--action-selected, rgba(0, 0, 0, 0.08))',
            color: 'var(--text-primary, rgba(0, 0, 0, 0.87))',
          },
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box
      sx={{
        ...config.sx,
        padding: '4px 12px',
        fontSize: '0.75rem',
        fontWeight: 500,
        display: 'inline-block',
      }}
    >
      {config.text}
    </Box>
  );
};

interface DashboardProjectsProps {
  projects: ProjectWithAllNestedData[];
}

export const getProjectImage = (
  pictures: ProjectWithAllNestedData['pictures']
) => {
  if (!pictures) return '';
  const projectImage = pictures.find(pic => pic.type === 'CARD')?.url;
  return projectImage ?? pictures[0]?.url;
};

export const displayEquityIRR = (project: ProjectWithAllNestedData) => {
  const { equityIRRMin, equityIRRMax } = project.investmentStats;
  return equityIRRMin === equityIRRMax
    ? `${equityIRRMin}%`
    : `${equityIRRMin}% - ${equityIRRMax}%`;
};

export const displayDebtInterest = (project: ProjectWithAllNestedData) => {
  const { interestRateMin, interestRateMax } = project.investmentStats;
  return interestRateMin === interestRateMax
    ? `${interestRateMin}%`
    : `${interestRateMin}% - ${interestRateMax}%`;
};

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatNumber = (num: number) =>
    num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);

  return (
    <Card sx={{ borderRadius: '8px', mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: '20px', mb: 2 }}>
          Current Opportunities
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {projects.map(project => {
          const headerImage = getProjectImage(project.pictures);

          return (
            <StyledCard key={project.id} elevation={1}>
              <Grid
                container
                spacing={3}
                direction={isMobile ? 'column' : 'row'}
                alignItems="center"
              >
                <Grid size={{ xs: 12, sm: 2 }}>
                  <ProjectImage>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headerImage ?? `/project-images/${project.id}.jpg`}
                      alt={project.name}
                    />
                  </ProjectImage>
                </Grid>

                <Grid size={{ xs: 12, sm: 10 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.location}
                      </Typography>
                    </Box>

                    {!isMobile && (
                      <Button
                        variant="grayPill"
                        href={`/projects/${project.slug}`}
                        sx={{
                          alignSelf: 'flex-start',
                          whiteSpace: 'nowrap',
                          padding: '8px 24px',
                        }}
                      >
                        VIEW OPPORTUNITIES
                      </Button>
                    )}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 1 }}>
                    {/* Total Units - Always shown */}
                    <Grid size={{ xs: 3 }}>
                      <ProjectMetric>
                        <Typography variant="h6">
                          {formatNumber(project.propertyStats.numUnits)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Units
                        </Typography>
                      </ProjectMetric>
                    </Grid>

                    {/* Debt Return */}
                    <Grid size={{ xs: 3 }}>
                      <ProjectMetric>
                        {project.investmentStats.boolDebt ? (
                          <>
                            <Typography variant="h6">
                              {displayDebtInterest(project)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Debt Return
                            </Typography>
                          </>
                        ) : null}
                      </ProjectMetric>
                    </Grid>

                    {/* Equity Return */}
                    <Grid size={{ xs: 3 }}>
                      <ProjectMetric>
                        {project.investmentStats.boolEquity ? (
                          <>
                            <Typography variant="h6">
                              {displayEquityIRR(project)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Equity Return
                            </Typography>
                          </>
                        ) : null}
                      </ProjectMetric>
                    </Grid>

                    {/* Status Badge */}
                    <Grid size={{ xs: 3 }}>
                      <ProjectMetric
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <StatusBadge status={project.status} />
                      </ProjectMetric>
                    </Grid>
                  </Grid>

                  {isMobile && (
                    <Button
                      variant="neutralYellow"
                      href={`/projects/${project.slug}`}
                      fullWidth
                      sx={{
                        mt: 2,
                        padding: '8px 16px',
                      }}
                    >
                      VIEW PROJECT
                    </Button>
                  )}
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
