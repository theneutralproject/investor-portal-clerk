import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";
import Link from "next/link";
import ProjectMetrics from "./ProjectMetrics";
import { type ProjectWithPicturesAndMilestones } from "@/libs/prisma";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ProjectCard: React.FC<{ project: ProjectWithPicturesAndMilestones }> = ({
  project,
}) => {
  const cardPicture = project?.pictures?.find(
    (picture) => picture.type === "CARD"
  );

  const convertedStatus = () => {
    if (project.status === "ACTIVE") return "Funding";
    if (project.status === "INACTIVE") return "Funded";

    return project.status;
  };

  const status = convertedStatus();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        maxWidth: 345,
        minWidth: 345,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={cardPicture?.url}
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
              backgroundColor: "#31713D",
              borderRadius: "100px",
              padding: "6px 10px",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
            }}
          >
            {status}
            {status === "Funded" && (
              <CheckCircleIcon style={{ color: "white", fontSize: "16px" }} />
            )}
          </Button>
        </Box>
      </CardContent>

      <Divider />

      <ProjectMetrics project={project} />

      <Divider />

      <CardContent>
        <Link href={`/projects/${project.slug}`} passHref>
          <Button variant="neutralBlack" fullWidth>
            VIEW
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
