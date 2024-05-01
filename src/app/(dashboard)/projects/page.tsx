"use client";

import ProjectCard from "@/components/Project/ProjectCard";
import { Box, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import { useUser } from "@clerk/nextjs";

import { type ProjectWithPictures } from "@/libs/prisma";

const Dashboard = () => {
  const { user } = useUser();
  const { isLoading, data } = useQuery<ProjectWithPictures[], Error>({
    queryKey: ["project", "all"],
    queryFn: () =>
      axios.get<ProjectWithPictures[]>("/api/projects").then((res) => res.data),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  return (
    <Box>
      <ProjectPageBanner
        background="/projectBanner.png"
        headline={`Welcome, ${user?.firstName ?? "User"}`}
        description="Diversify your portfolio with direct investments in local, sustainable real estate properties. Discover active projects below and take your next step to coming an investor."
      />

      <Typography variant="h5" sx={{ mt: 4 }}>
        All Projects
      </Typography>
      <Grid sx={{ display: "flex", flexWrap: "wrap" }}>
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
