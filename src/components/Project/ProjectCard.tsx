import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { type Project } from "@prisma/client";
import { capitalize } from "lodash";
import Link from "next/link";
import ProjectMetrics from "./ProjectMetrics";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        maxWidth: 345,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image="https://via.placeholder.com/330x200.png?text=Project+Image"
        alt="Project image"
      />

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" component="div">
              {project.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.location}
            </Typography>
          </Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#626F52",
              borderRadius: "100px",
              padding: "4px 8px",
              textTransform: "none",
            }}
          >
            {capitalize(project.status)}
          </Button>
        </Box>
      </CardContent>

      <Divider />

      <ProjectMetrics project={project} />

      <Divider />

      <CardContent>
        <Link href={`/projects/${project.id}`} passHref>
          <Button variant="neutralBlack" fullWidth>
            VIEW
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
