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

const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatNumber = (num: number) =>
    num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);

  const calculateFundingProgress = (raised: number, goal: number) =>
    Math.min((raised / goal) * 100, 100);

  return (
    <Card sx={{ borderRadius: '8px', mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: '20px', mb: 2 }}>
          Projects
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {projects.map(project => {
          const headerImage = getProjectImage(project.pictures);
          const fundingProgress = calculateFundingProgress(
            project.investmentStats.investmentRaised,
            project.investmentStats.investmentGoal
          );

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
                        VIEW PROJECT
                      </Button>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
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

                  {!isMobile && (
                    <LinearProgress
                      variant="determinate"
                      value={fundingProgress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          backgroundColor: '#2f7d32',
                        },
                      }}
                    />
                  )}

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
