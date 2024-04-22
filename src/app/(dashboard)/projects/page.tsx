"use client";

import ProjectCard from "@/components/Project/ProjectCard";
import { Box } from "@mui/material";
import { type Project } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Dashboard = () => {
  const { isLoading, data } = useQuery<Project[], Error>({
    queryKey: ["project", "all"],
    queryFn: () =>
      axios.get<Project[]>("/api/projects").then((res) => res.data),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  return (
    <Box>
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Box>
  );
};

export default Dashboard;
