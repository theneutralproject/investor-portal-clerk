import React from "react";
import { Divider } from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import { type Project } from "@prisma/client";
import CollapsibleCard from "./CollapsibleCard";

const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 2 });

const BuildingDetails = ({ data }: { data: Project }) => {
  return (
    <CollapsibleCard title="Building Details">
      <Divider />

      <LineDisplay name="Total Units" value={`${data.buildingUnits}`} />
      <LineDisplay
        name="Avg. Unit Size"
        value={`${data.buildingAvgUnitSize} SF`}
      />
      <LineDisplay name="Avg. Gross Rent" value={`$${formatter.format(data.buildingAvgRent)}`} />
      <LineDisplay
        name="Commercial Sq. Ft."
        value={`${formatter.format(data.buildingCommSqFt)} SF`}
      />
    </CollapsibleCard>
  );
};

export default BuildingDetails;
