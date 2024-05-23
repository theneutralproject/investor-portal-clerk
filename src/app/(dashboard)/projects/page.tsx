"use client";

import ProjectCard from "@/components/Project/ProjectCard";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import { useUser } from "@clerk/nextjs";

import { type ProjectWithPictures } from "@/libs/prisma";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { useEffect } from "react";
import posthog from "posthog-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'

const Dashboard = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useUser();
  const { isLoading, data } = useQuery<ProjectWithPictures[], Error>({
    queryKey: ["project", "all"],
    queryFn: () =>
      axios.get<ProjectWithPictures[]>("/api/projects").then((res) => res.data),
  });

  const searchParams = useSearchParams();
  useEffect(() => {
    if (user && searchParams.get('afterauth')) {
      const { id, primaryEmailAddress, firstName, lastName } = user;
      posthog.identify(primaryEmailAddress?.toString(), { email: primaryEmailAddress?.toString(), firstname: firstName, lastname: lastName, id: id });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [user, searchParams])

  if (isLoading) {
    <Suspense>
      return <div>Loading...</div>;
    </Suspense>
  }

  if (!data || !Array.isArray(data)) {
    <Suspense>
      return <div>No data available</div>;
    </Suspense>
  }



  return (
    <Suspense>
      <Box>
        <ProjectPageBanner
          background="/projectBanner.png"
          headline={`Welcome, ${user?.firstName ?? "User"}`}
          description="And welcome to a more sustainable tomorrow. Thank you for your interest in investing with Neutral. We believe in the power of thoughtful investment to positively impact your portfolio and the planet. Exploring the projects below allows you to discover innovative, sustainable, and regenerative development solutions."
        />

        <Typography
          variant="h5"
          sx={{ mt: 4, textAlign: isMobile ? "center" : "unset" }}
        >
          All Projects
        </Typography>
        <Grid
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {data!.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Grid>
      </Box>
    </Suspense>
  );
};

export default Dashboard;
