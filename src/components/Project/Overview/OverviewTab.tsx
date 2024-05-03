import {
  Typography,
  CardContent,
  Card,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { theme } from "../../Shell/NeutralThemeProvider";
import InvestmentSummaryBox from "./InvestmentSummaryBox";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import BuildingDetails from "./BuildingDetails";
import BasicTitleDescriptionCard from "../BasicTitleDescriptionCard";
import { type Project } from "@prisma/client";
import ProjectCalculator from "./ProjectCalculator";

export const OverviewTab = ({ data }: { data: Project }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let youtubeID = "";
  if (data.youtubeUrl?.includes("v=")) {
    youtubeID = data.youtubeUrl.split("v=")[1]!;
  }
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent sx={{ p: isMobile ? 0 : "16px" }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Investment Summary
            </Typography>
            <Divider sx={{ mt: 2, mb: 2 }} />

            <InvestmentSummaryBox data={data} />
          </CardContent>
        </Card>
        <BasicTitleDescriptionCard
          title="Project Description"
          description={data.description}
        />
        {youtubeID.length > 5 && (
          <Card sx={{ mt: theme.spacing(2) }}>
            <LiteYouTubeEmbed id={youtubeID} title={data.name} />
          </Card>
        )}
        <BuildingDetails data={data} />
        <ProjectCalculator data={data} />
        <BasicTitleDescriptionCard
          title="Market Highlights"
          description={data.marketHighlights}
        />
      </CardContent>
    </Card>
  );
};
