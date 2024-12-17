import React from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import CollapsibleCard from "./CollapsibleCard";
import type { ProjectWithStats } from "@/libs/types";

const formatter = Intl.NumberFormat("en", { maximumFractionDigits: 2 });

const BuildingDetailsNew = ({ data }: { data: ProjectWithStats }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Building Details
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <LineDisplay
          name="Total Units"
          value={`${data.propertyStats.numUnits}`}
        />
        <LineDisplay
          name="Avg. Unit Size"
          value={`${data.propertyStats.avgUnitSize} SF`}
        />
        <LineDisplay
          name="Avg. Gross Rent"
          value={`$${formatter.format(data.propertyStats.avgRent)}`}
        />
        <LineDisplay
          name="Commercial Sq. Ft."
          value={`${formatter.format(data.propertyStats.commercialSqFt)} SF`}
        />
      </CardContent>
    </Card>
  );
};

export default BuildingDetailsNew;
