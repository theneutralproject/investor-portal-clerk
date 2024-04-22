import React from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { type Project } from "@prisma/client";

function ProjectHeader({
  data,
  percentRaised,
  tabValue,
  onTabChange,
  dealStage,
}: {
  data: Project;
  percentRaised: number;
  tabValue: number;
  onTabChange: (value: number) => void;
  dealStage: number;
}) {
  return (
    <Card>
      <CardContent sx={{ paddingBottom: "0 !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              {data?.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {data?.location}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography variant="caption" sx={{ mr: 2 }}>
              Fund Tracker:
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={percentRaised}
                size={50}
                thickness={5}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption">{percentRaised}%</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          aria-label="Deal Tabs"
          sx={{ m: "0" }}
        >
          <Tab label="Overview" />
          <Tab label="Project Docs" />
          {dealStage >= 2 ? (
            <Tab label="Invest" />
          ) : (
            <Tab
              icon={<LockIcon />}
              iconPosition="start"
              label="Invest"
              disabled
              sx={{ opacity: "0.5" }}
            />
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ProjectHeader;
