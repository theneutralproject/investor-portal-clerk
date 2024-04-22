import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { type Project } from "@prisma/client";
import Link from "next/link";

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
        height="140"
        image="https://via.placeholder.com/345x140.png?text=Project+Image"
        alt="Project image"
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {project.location}
        </Typography>
      </CardContent>

      <CardContent sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href={`/projects/${project.id}`} passHref>
          <Button size="small" color="primary">
            VIEW
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
