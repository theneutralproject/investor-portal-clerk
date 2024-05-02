import { Typography, CardContent, Card, Divider } from "@mui/material";
import { theme } from "../../Shell/NeutralThemeProvider";
import InvestmentSummaryBox from "./InvestmentSummaryBox";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import BuildingDetails from "./BuildingDetails";
import BasicTitleDescriptionCard from "../BasicTitleDescriptionCard";
import { type Project } from "@prisma/client";
import ProjectCalculator from "./ProjectCalculator";

export const OverviewTab = ({ data }: { data: Project }) => {
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
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

        <Card sx={{ mt: theme.spacing(2) }}>
          <LiteYouTubeEmbed id="ocvR5xUWLP4" title="The Edison" />
        </Card>

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
