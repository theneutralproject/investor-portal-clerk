import React from "react";
import { Divider } from "@mui/material";
import { LineDisplay } from "./InvestmentSummaryBox";
import CollapsibleCard from "./CollapsibleCard";
import type { ProjectWithStats } from "@/libs/types";

const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 2 });

const BuildingDetails = ({ data }: { data: ProjectWithStats }) => {
  return (
    <CollapsibleCard title="Building Details">
      <Divider />

      <LineDisplay name="Total Units" value={`${data.propertyStats.numUnits}`} />
      <LineDisplay
        name="Avg. Unit Size"
        value={`${data.propertyStats.avgUnitSize} SF`}
      />
      <LineDisplay name="Avg. Gross Rent" value={`$${formatter.format(data.propertyStats.avgRent)}`} />
      <LineDisplay
        name="Commercial Sq. Ft."
        value={`${formatter.format(data.propertyStats.commercialSqFt)} SF`}
      />
    </CollapsibleCard>
  );
};

export default BuildingDetails;
