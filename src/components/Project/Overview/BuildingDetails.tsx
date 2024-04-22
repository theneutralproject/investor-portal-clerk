import React from "react";
import { Typography, Divider, Card, CardContent } from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import { theme } from "../../Shell/NeutralThemeProvider";
import { type Project } from "@prisma/client";

const BuildingDetails = ({ data }: { data: Project }) => {
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Building Details
        </Typography>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <LineDisplay name="Total Units" value={"-"} />
        <LineDisplay name="Avg. Unit Size" value={"-"} />
        <LineDisplay name="Avg. Gross Rent" value={"-"} />
        <LineDisplay name="Residential Units" value={data?.numUnits} />
        <LineDisplay name="Commercial Sq. Ft." value={"-"} />
      </CardContent>
    </Card>
  );
};

export default BuildingDetails;
