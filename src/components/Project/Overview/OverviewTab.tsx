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
          description="NOT IN CURRENTLY: The Edison is a premier multifamily property
          consisting of 381 luxury for rent apartments, situated alongside the
          beautiful Milwaukee RiverWalk in core downtown Milwaukee, Wisconsin.
          The Edison caters to the high-end luxury housing market in Milwaukee,
          and also sets a new standard for building design and construction
          practices by leveraging Mass Timber technology. This innovative
          approach not only creates a stunning visual appeal but also addresses
          the growing concern of environmental impact by using sustainable
          building materials and targeting Passive House (Phius) certification.
          The project will feature best in class amenities including; cafe,
          fitness center, spa, pool, sauna, demo kitchen, sky lounge, dog park,
          movie room, community garden, entertainment deck with kitchens and an
          outdoor sport court. At 32 stories tall, The Edison is on track to
          become the tallest mass timber building in the world."
        />

        <Card sx={{ mt: theme.spacing(2) }}>
          <LiteYouTubeEmbed
            id="L2vS_050c-M"
            title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
          />
        </Card>

        <BuildingDetails data={data} />
        <ProjectCalculator data={data} />

        <BasicTitleDescriptionCard
          title="Market Highlights"
          description="NOT IN CURRENTLY: The Edison is a premier multifamily property
          consisting of 381 luxury for rent apartments, situated alongside the
          beautiful Milwaukee RiverWalk in core downtown Milwaukee, Wisconsin.
          The Edison caters to the high-end luxury housing market in Milwaukee,
          and also sets a new standard for building design and construction
          practices by leveraging Mass Timber technology. This innovative
          approach not only creates a stunning visual appeal but also addresses
          the growing concern of environmental impact by using sustainable
          building materials and targeting Passive House (Phius) certification.
          The project will feature best in class amenities including; cafe,
          fitness center, spa, pool, sauna, demo kitchen, sky lounge, dog park,
          movie room, community garden, entertainment deck with kitchens and an
          outdoor sport court. At 32 stories tall, The Edison is on track to
          become the tallest mass timber building in the world."
        />
      </CardContent>
    </Card>
  );
};
